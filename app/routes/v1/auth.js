// Packages
import express from 'express';
import { DateTime } from 'luxon';
import generator from 'generate-password';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

//Utils
import { checkToken, checkRole, formDataParser } from './index';
import { mongoose } from '../../utils/database';
import { response } from '../../utils/misc';
import { sendEmail } from '../../utils/email';
import errors from '../../utils/errors';
import config from '../../utils/config';

//Models
import Token from '../../models/token';
import Staff from '../../models/staff';
import User from '../../models/user';
import Invite from '../../models/invite';
import NotificationToken from '../../models/notificationToken';

const auth = async (req, res, next) => {
	const { body } = req;
	const { source } = req.headers;
	const lang = req.headers['accept-language'];
    const isBO = source === 'bo', isAPP = source === 'app', isWEB = source === 'web';
	let user;
	console.log('BODY', body);
	
	if (!isBO) {
		if  (!body.email && body.identityTokenApple) {
			console.log('ENTREI AQUI')
			const decoded = jwt.decode(body.identityTokenApple);
			console.log('DECODED', decoded);
			body.email = decoded.email;
			body.name = body.name === 'null null' ? body.name = '' : body.name;
			console.log('SAI AQUI', body.email)
		}

		user = await User.findOne({ email: body.email });
	} else {
		user = await Staff.findOne({ email: body.email });
		if (!user) throw errors.invalid_credentials;
	}
	
	if (user && body.password && !user.comparePassword(body.password)) {
		throw errors.invalid_credentials;
	}
	
	if (user && body.password && !user.isConfirmed) {
		const confirmationCode = Math.floor(Math.random() * 9000) + 1000;
		if (!isBO) {
			await User.updateOne({ _id: user._id }, { $set: { confirmationCode } });
			if (isAPP) {
				await sendEmail(config.keyEmails.confirmAccountCode, null, { ...config.emailTags, code: confirmationCode }, user.email, lang);

				return { status: 400, code: 'USER_NOT_CONFIRMED', message: 'User not confirmed', user, confirmationCode };
			} else if (isWEB) {
				await sendEmail(config.keyEmails.confirmAccountLink, null, { ...config.emailTags, link: `${process.env.WEB_URL}/confirm/${user._id}/${confirmationCode}` }, user.email, lang);

				return { status: 400, code: 'USER_NOT_CONFIRMED', message: 'User not confirmed, please check your email and confirm your account' };
			}
		} else {
			const [invite, owner] = await Promise.all([
				Invite.findOne({ staff: user._id }).populate('staff from'),
				Staff.findOne({ role: 'owner' })
			])

			if (invite)	{
				await sendEmail(config.keyEmails.confirmStaffLink, null, { ...config.emailTags, staff_name: invite.from.name, staff_email: invite.from.email, link: `${process.env.BO_URL}/accept-invite/${invite._id}/${invite.invitationCode}` }, invite.staff.email );
			} else {
				const invite = await Invite({ staff: user._id, from: owner._id, invitationCode: confirmationCode }).save();
				await sendEmail(config.keyEmails.confirmStaffLink, null, { ...config.emailTags, staff_name: owner.name, staff_email: owner.email, link: `${process.env.BO_URL}/accept-invite/${invite._id}/${invite.invitationCode}` }, invite.staff.email );
			}

			return { status: 400, code: 'USER_NOT_CONFIRMED', message: 'Utilizador não confirmado, enviámos um email, de modo a que possa concluir o processo de confirmação' };
		}
	}

	if (!user) {
		if (!isBO && body.googleToken) {
			const newGoogleUser = new User(body);
			newGoogleUser.isGoogle = true;
			user = await newGoogleUser.save();
		} else if (!isBO && body.facebookToken) {
			const newFacebookUser = new User(body);
			newFacebookUser.isFacebook = true;
			user = await newFacebookUser.save();
		} else if (!isBO && (body.appletoken || body.identityTokenApple)) {
			const newAppleUser = new User(body);
			newAppleUser.isApple = true;
			user = await newAppleUser.save();
		} else { 
			throw errors.invalid_credentials 
		}
	} else {
		if (!isBO && body.googleToken) {
			await User.updateOne({ _id: user._id }, { $set: { googleToken: body.googleToken, isGoogle: true } });
		} else if (!isBO && body.facebookToken) {
			await User.updateOne({ _id: user._id }, { $set: { facebookToken: body.facebookToken, isFacebook: true } });
		} else if (!isBO && body.appleToken) {
			await User.updateOne({ _id: user._id }, { $set: { appleToken: body.appleToken, isApple: true } });
		}
	}	

	const token = generator.generateMultiple(2, { length: 30, numbers: true }).toString().replace(',', '.');
	const newToken = new Token({
		user: !isBO ? user._id : null,
		staff: isBO ? user._id : null,
		authToken: token,
		dateExpired: DateTime.utc().plus({ days: config.tokenDuration }).toISO(),
	});
	await newToken.save();
	
	user = user.displayInfo();

	return { status: 200, code: 'LOGIN_SUCCESS', message: 'Login Success', user, token };
};

const signOut = async (req, res, next) => {
	let token = req.headers['authorization'];
	if (token) {
		token = token.split(' ');
	
		await Token.deleteOne({ authToken: token[1] });
	}

	return { code: 200 };
};

const postNotificationToken = async (req, res, next) => {
	const { body: { notificationToken, device, language }, user } = req;

    if (!notificationToken) return { code: 200 };

    const updatedToken = {
        user: user.role === 'user' ? user._id : null,
        token: notificationToken,
        device: device,
        language: language ? language : 'pt'
    };

    await NotificationToken.findOneAndUpdate({ token: notificationToken }, updatedToken, { upsert: true });

	return { code: 200 };
};

const authRouter = (errorHandler) => {
	const router = express.Router();
	router
		.post('/login', errorHandler(async (req, res, next) => {
			const { code, status, message, ...responseObj } = await auth(req, res, next);
			response(req, res, status, code, message, responseObj);
		}))
		.post('/logout', errorHandler(async (req, res, next) => {
			const { code } = await signOut(req, res, next);
			response(req, res, code, 'LOGGED_OUT', 'Logged Out');
		}))
		.post('/notif-token', checkToken(), checkRole('user'), errorHandler(async (req, res, next) => {
			const { code } = await postNotificationToken(req, res, next);
			response(req, res, code, 'NOTIFICATION_TOKEN_ADDED', 'Notification Token Added');
		}));

	return router;
};

export const router = authRouter;