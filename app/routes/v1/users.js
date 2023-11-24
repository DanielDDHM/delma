// Packages
import express from 'express';
import { DateTime, Duration } from 'luxon';
import bcrypt from 'bcrypt';
import generator from 'generate-password';
import _ from 'lodash';

// Utils
import { checkToken, checkRole, formDataParser } from './index';
import { response } from '../../utils/misc';
import { uploadImage, deleteImage } from '../../utils/upload';
import { sendEmail } from '../../utils/email';
import { mongoose } from '../../utils/database';
import errors from '../../utils/errors';
import config from '../../utils/config';

// Model
import User from '../../models/user';
import Token from '../../models/token';

const ObjectId = mongoose.Types.ObjectId;

const getUser = async (req, res, next) => {
	const { user } = req;

	return { user, code: 200 };
};

const postUsersSearch = async (req, res, next) => {
	const { perPage, page, search, sort, filters } = req.body;

	const num = Number(perPage || 100);
	const pageNum = Number(page || 0);

	const userQuery = {};

	if (search && search.length) {
		const regex = new RegExp(search, 'i');
		const searchQuery = [];

		searchQuery.push({ name: { $regex: regex } });
		searchQuery.push({ email: { $regex: regex } });
		searchQuery.push({ phone: { $regex: regex } });

		userQuery.$or = searchQuery;
	}

	const availableBooleanFilters = ['isActive'];
	const availableTextFilters = ['name', 'email', 'phone'];

	if (filters && Object.keys(filters).length) {
		userQuery.$and = [];
		for (const fil in filters) {
			const regex = new RegExp(filters[fil], 'i');
			if (availableBooleanFilters.includes(fil)) {
				userQuery.$and.push({ [fil]: filters[fil] });
			} else if (availableTextFilters.includes(fil)) {
				userQuery.$and.push({ [fil]: { $regex: regex } });
			} else {
				userQuery.$and.push({ [fil]: { $regex: regex } });
			}
		}
	}

	const usersAgg = await User.aggregate([
		{ $match: userQuery },
		{ $project: { password: 0 } },
		{ $facet: {
			total: [
				{ $group: { _id: null, count: { $sum: 1 } } },
                { $project: { _id: 0 } }
			],
			users: [
				{ $skip: num * pageNum },
				{ $limit: num },
			]
		} },
	])

	const { total, users } = usersAgg[0]

	return { users, total: total.length ? total[0].count : 0, code: 200 };
};

const postConfirmUser = async (req, res, next) => {
	const { params: { id }, body: { code } } = req;

	if (!code || !id) throw errors.not_found;
	let user = await User.findOneAndUpdate({ _id: id, confirmationCode: code }, { isConfirmed: true, code: null }, { new: true });

	if (!user) throw errors.invalid_credentials;

	const token = generator.generateMultiple(2, { length: 30, numbers: true }).toString().replace(',', '.');
	const newToken = new Token({
		user: user._id,
		authToken: token,
		dateExpired: DateTime.utc().plus({ days: config.tokenDuration }).toISO(),
	});
	await newToken.save();

	user = user.displayInfo();

	return { user, token, code: 200 };
};

const postUser = async (req, res, next) => {
	const { body, headers: { source } } = req;
	const lang = req.headers['accept-language'];

	if (!body.email || !body.password || !body.name) {
		throw errors.required_fields_empty;
	}
	
	let user = await User.findOne({ email: body.email });
	if (user) throw errors.duplicate_email;
	
	const confirmationCode = Math.floor(Math.random() * 9000) + 1000;

	if (body.files && body.files.length) {
		const photo = body.files.find(f => f.fieldName === 'photo');
		
		if (!!photo && user.photo) {
			await deleteImage(user.photo, 'users');
			body.photo = await uploadImage(photo, 'users');
		} else { body.photo = await uploadImage(photo, 'users') }
	}
	body.password = bcrypt.hashSync(body.password, 10);
	body.confirmationCode = confirmationCode;

	const newUser = await new User(body).save();
	
	if (source == 'app') {
		console.log('CHEGUEI AQUI', config.keyEmails.confirmAccountCode)
		await sendEmail(config.keyEmails.confirmAccountCode, null, { ...config.emailTags, code: confirmationCode}, newUser.email, lang);
	} else {
		await sendEmail(config.keyEmails.confirmAccountLink, null, { ...config.emailTags, link: `${process.env.WEB_URL}/confirm/${newUser._id}/${confirmationCode}` }, newUser.email, lang);
	}

	user = newUser.displayInfo();

	return { user, confirmationCode: confirmationCode, code: 201 };
};

const putUpdateUser = async function (req, res, next) {
	const { body, params } = req;

	let user = await User.findOne({ _id: params.id });
	if (!user) throw errors.not_found;
	if (params.id != user._id) throw errors.no_permission;

	if (body.files && body.files.length) {
		const photo = body.files.find(f => f.fieldName === 'photo');
		
		if (!!photo && user.photo) {
			await deleteImage(user.photo, 'users');
			body.photo = await uploadImage(photo, 'users');
		} else { body.photo = await uploadImage(photo, 'users') }
	}

	user = await User.findOneAndUpdate({ _id: params.id }, body, { fields: '-password', new: true });
	
	return { code: 200, user };
};

const putChangeUserPassword = async function (req, res, next) {
	const { body, user } = req;

	let currentUser = await User.findOne({ email: user.email });

	if (!currentUser || !currentUser.comparePassword(body.currentPassword)) throw errors.invalid_credentials;
		
	const newPassword = bcrypt.hashSync(body.password, 10);
	currentUser = await User.findOneAndUpdate({ email: user.email }, { password: newPassword },	{ fields: '-password', new: true });

	return { user: currentUser, code: 200 };
};

const postRecoverPasswordUser = async (req, res, next) => {
	const { body, params, headers: { source } } = req;
	const lang = req.headers['accept-language'];

	const codeParams = params.code;
	let user = {};

	user = await User.findOne({ email: body.email }).lean();
	if (!user) return { code: 200 };

	if (!codeParams) {
		const resetCode = Math.floor(Math.random() * 9000) + 1000;
		await User.updateOne({ email: body.email }, { resetCode });

		if (source === 'app') {
			await sendEmail(config.keyEmails.recoverPasswordCode, null, { ...config.emailTags, code: resetCode }, user.email, lang);
			return { code: 200, resetCode };
		} else {
			await sendEmail(config.keyEmails.recoverPasswordLink, null, { ...config.emailTags, link: `${process.env.WEB_URL}/recover-password/${user._id}/${resetCode}` }, user.email, lang);
			return { code: 200 };
		}
	} else {
        const password = bcrypt.hashSync(body.password, 10);
		user = await User.findOneAndUpdate({ _id: user._id, resetCode: codeParams }, { password, resetCode: null, isConfirmed: true }).lean();
	
        if (!user) throw errors.invalid_credentials;
	
        return { code: 200 };
	}
};

const patchResendCode = async (req, res, next) => {
	const { params: { id }, headers: { source } } = req;
	const lang = req.headers['accept-language'];

	
	const user = await User.findOne({ _id: id }).lean();
	if (!user) return { code: 200 };
	let confirmationCode = user.confirmationCode;

	if (!confirmationCode) {
		confirmationCode = Math.floor(Math.random() * 9000) + 1000;
		await User.updateOne({ _id: user._id }, { confirmationCode });
	}

	if (source === 'app') {
		await sendEmail(config.keyEmails.confirmAccountCode, null, { ...config.emailTags, code: confirmationCode}, user.email, lang);
	} else {
		await sendEmail(config.keyEmails.confirmAccountLink, null, { ...config.emailTags, link: `${process.env.WEB_URL}/confirm/${newUser._id}/${confirmationCode}` }, user.email, lang);
	}
	
    return { code: 200, confirmationCode };
};

const getHome = async (req) => {
	const { user } = req;


	return { code: 200 };
};

const patchForgotUser = async req => {
	const { id } = req.params;

	let existUser = await User.findOne({ _id: id });
	if (!existUser) errors.not_found;

	console.log('USER', user);

	const forgotUser = {
		email: `${id}@delmanicolace.com`,
		name: 'John Doe',
		password: null,
		photo: null,
		isGoogle: false,
		googleToken: null,
		isFacebook: false,
		facebookToken: null,
		isApple: false,
		appleToken: null,
		password: null,
		phone: null,
		confirmationCode: null,
		resetCode: null,
		isActive: false,
		isDelete: true
	}

	const [ user ] = await Promise.all([
		User.findOneAndUpdate({ _id: id }, forgotUser, { new: true }),
		Token.deleteMany({ user: id }),
	])

	console.log('USER', user);

	return { code: 200, user };
};



const usersRouter = (errorHandler) => {
	const router = express.Router();
	router
		.get('/home', checkToken(false, true), checkRole('user'), errorHandler(async (req, res, next) => {
			const { code } = await getHome(req, res, next);
			response(req, res, code, 'USER_HOME_FOUND', 'Found User Home', {  });
		}))
		
		.get('/:id?', checkToken(), errorHandler(async (req, res, next) => {
			const { code, user } = await getUser(req, res, next);
			response(req, res, code, 'USERS_FOUND', 'Found Users', { user });
		}))
		
		.post('/search', checkToken(), checkRole('sysadmin', 'owner', 'admin'), errorHandler(async (req, res, next) => {
			const { code, users, total } = await postUsersSearch(req, res, next);
			response(req, res, code, 'USERS_FOUND', 'Found Users', { users, total });
		}))
		.post('/', errorHandler(async (req, res, next) => {
			const { code, user, confirmationCode } = await postUser(req, res, next);
			response(req, res, code, 'USER_CREATED', 'User has been created', { user, confirmationCode });
		}))
		.post('/recover-password/:code?', errorHandler(async (req, res, next) => {
			const { code, resetCode } = await postRecoverPasswordUser(req, res, next);
			if (req.headers.source === 'app') {
				response(req, res, code, 'PASSWORD_RESET', 'User password reset', { resetCode });
			} else {
				response(req, res, code, 'PASSWORD_RESET', 'User password reset');
			}
		}))
		.post('/confirm/:id', errorHandler(async (req, res, next) => {
			const { code, user, token } = await postConfirmUser(req, res, next);
			response(req, res, code, 'USER_CONFIRMED', 'User has been confirmed', { user, token });
		}))

		.put('/change-password', checkToken(), checkRole('user'), errorHandler(async (req, res, next) => {
			const { code, user } = await putChangeUserPassword(req, res, next);
			response(req, res, code, 'USER_PASSWORD_CHANGED', 'User has been updated', { user });
		}))
		.put('/:id', checkToken(), checkRole('user'), formDataParser(), errorHandler(async (req, res, next) => {
			const { code, user } = await putUpdateUser(req, res, next);
			response(req, res, code, 'USER_UPDATED', 'User has been updated', { user });
		}))

		.patch('/:id/resend-code', errorHandler(async (req, res, next) => {
			const { code, confirmationCode } = await patchResendCode(req, res, next);
			response(req, res, code, 'CODE_RESEND', 'The code has been resented', { confirmationCode });
		}))
		.patch('/:id/forget', checkToken(), checkRole('sysadmin', 'owner'), errorHandler(async (req, res, next) => {
			const { code, user } = await patchForgotUser(req, res, next);
			response(req, res, code, 'USER_FORGOTTEN', 'User has been forgotten', { user });
		}));
	return router;
};

export const router = usersRouter;
