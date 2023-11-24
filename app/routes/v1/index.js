// Packages
import express from 'express';
import _ from 'lodash';
import { DateTime } from 'luxon';

// Utils
import { mongoose } from '../../utils/database';
import { error } from '../../utils/misc';
import errors from '../../utils/errors';
import config from '../../utils/config'
import Busboy from 'busboy';

// Models
import Token from '../../models/token';
import Staff from '../../models/staff';
import User from '../../models/user';

// Router
import { router as authRouter } from './auth';
import { router as countriesRouter } from './countries';
import { router as albunsRouter } from './albuns';
// import { router as musicsRouter } from './musics';
import { router as bookRouter } from './books';
import { router as emailTemplatesRouter } from './email-templates';
import { router as pagesRouter } from './pages';
import { router as notificationsRouter } from './schedule-notifs';
import { router as staffRouter } from './staff';
import { router as statisticsRouter } from './statistics';
import { router as usersRouter } from './users';

const errorHandler = (fn) => {
	return function (req, res, next) {
		return fn(req, res, next).catch(err => {
			next(error(err));
		});
	};
};

export const formDataParser = function () {
	return async (req, res, next) => {
		try {
			const availableExtensions = ['png', 'jpeg', 'jpg', 'mov', 'mp3', 'mp4', 'mpeg', 'ogg', 'xlsx', 'octet-stream', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
			const contentType = req.headers['content-type'];

			if (contentType && contentType.includes('form-data')) {
				req.headers['content-type'] = contentType;
				const busboy = new Busboy({
					headers: {
						'content-type': contentType,
					},
				});

				const result = {
					files: [],
				};

				busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {

					const fileExt = mimetype.split('/')[1].toLowerCase();
					console.log("filext", fileExt);
					if (!availableExtensions.includes(fileExt)) throw errors.invalid_file_extension;

					const fileData = [];
					file.on('data', data => {
						fileData.push(data);
					});

					file.on('end', () => {
						result.files.push({
							file: Buffer.concat(fileData),
							fileName: filename,
							fieldName: fieldname,
							contentType: mimetype,
						});
					});
				});

				busboy.on('field', (fieldname, value) => {
					try {
						result[fieldname] = JSON.parse(value);
					} catch (err) {
						result[fieldname] = value;
					}
				});

				busboy.on('finish', function () {
					req.body = result;
					busboy.end();
					next();
				});
				req.pipe(busboy);
			}
		} catch (err) {
			return next(error(err));
		}
	};
};

export const checkToken = function (tokenless = false) {
	return async (req, res, next) => {
		try {
			let token = req.headers['authorization'];
			const apiKey = req.headers['api-key'];
			if (token){

				token = token.split(' ');
				if (token[0] !== 'Bearer') throw errors.invalid_header;
				if (token[1] == void 0 || token[1] == 'null') throw errors.invalid_token;
				
				const newToken = await Token.findOne({ authToken: token[1] });
				if (!newToken) {
					throw errors.invalid_token;
				}
	
				if (DateTime.utc() >= DateTime.fromISO(newToken.dateExpired).toUTC()) {
					await Token.findOneAndDelete({ authToken: token[1] });
					throw errors.token_expired;
				}
	
				await Token.updateOne({ _id: newToken._id }, { '$set': { dateExpired: DateTime.utc().plus({ days: config.tokenDuration }).toISO() } });
	
				if (newToken.staff) {
					const staff = await Staff.findOne({ _id: newToken.staff }).lean();
					req.user = staff;
                    if (!req.user) throw errors.invalid_token;
				} else {
                    req.user = User.findOne({ _id: newToken.user });
                    if (!req.user) throw errors.invalid_token;
                    req.user.role = 'user';
				}
				next();
			} else if ((apiKey || tokenless) && !token) {
				if (apiKey == config.apiKey || tokenless) {
					return next();
				} else throw errors.invalid_api_key;
			} else throw errors.invalid_token;
		} catch (err) {
			return next(error(err));
		}
	};
};

export const checkRole = function () {
	let requestedRoles = _.flatten(arguments);

	return function (req, res, next) {
		if (!req.user) return next(error(errors.invalid_credentials));

		console.log('REQUEST ROLE: ', requestedRoles);
		console.log('ROLE: ', req.user.role);

		if (requestedRoles.indexOf(req.user.role) == -1) return next(error(errors.no_permission));

		next();
	};
};

export default function (app, server, mode) {
	const router = express.Router();
        router.use('/albuns', albunsRouter(errorHandler));
        router.use('/auth', authRouter(errorHandler));
		router.use('/books', bookRouter(errorHandler));
		router.use('/countries', countriesRouter(errorHandler));
		router.use('/email-templates', emailTemplatesRouter(errorHandler));
        // router.use('/musics', musicsRouter(errorHandler));
		// router.use('/orders', ordersRouter(errorHandler));
        router.use('/pages', pagesRouter(errorHandler));
        // router.use('/payments', paymentsRouter(errorHandler));
		// router.use('/playlists', playlistsRouter(errorHandler));
        router.use('/notifications', notificationsRouter(errorHandler));
        router.use('/staff', staffRouter(errorHandler));
        router.use('/statistics', statisticsRouter(errorHandler));
        router.use('/users', usersRouter(errorHandler));
	return router;
}