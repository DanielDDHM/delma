// Packages
import express from 'express';
import _ from 'lodash';
import { DateTime } from 'luxon';

// Utils
import { mongoose } from '../../utils/database';
import {  checkToken, checkRole, checkUserHR  } from './index';
import { response, roundTo } from '../../utils/misc';
import errors from '../../utils/errors';

// Models
import User from '../../models/user';
import Statistic from '../../models/statistic';
import Log from '../../models/log';
import Meta from '../../models/meta';

const DAILY = 'daily';
const MONTHLY = 'monthly';

const ObjectId = mongoose.Types.ObjectId;

const getDashboard = async req => {
    const { query: { startDate, endDate }, headers: { source }} = req;

    if (source != 'bo') throw errors.no_permission;

    // Preparing dates
    let start = DateTime.local(), end = DateTime.local();
    if (startDate) start = DateTime.fromFormat(startDate, 'd/L/y');
    if (endDate) end = DateTime.fromFormat(endDate, 'd/L/y');

    const diff = end.diff(start, 'days').days;
    if (diff < 0) throw errors.bad_request;

    // Verifying form of grouping data
    let mode = MONTHLY;
    if (diff <= 90) {
		mode = DAILY;
	}

    const [ usersAggregation, usageAggregation ] = await Promise.all([
        User.aggregate([
            { $match: { confirmationDate: { $gte: start.startOf('day').toJSDate(), $lte: end.endOf('day').toJSDate() } } },
            { $facet: {
                userValues: [
                    { $group: {
                        _id: null,
                        count: { $sum: 1 },
                    } },
                ],
                sortedByDate: [
                    { $addFields: { m: { $month: '$_created' }, y: { $year: '$_created' } } },
                    { $group: {
                        _id: mode == MONTHLY ? { month: '$m', year: '$y' } : { $dayOfYear: '$_created' },
                        count: { $sum: 1 },
                    } },
                    { $sort: { _id: 1 } },
                ],
            } }
        ]),
        Statistic.aggregate([
            { $match: { date: { $gte: start.startOf('day').toJSDate(), $lte: end.endOf('day').toJSDate() } } },
            { $facet: {
                iosValues: [
                    { $match: { type: 'app', os: 'ios' } },
                    { $group: {
                        _id: null,
                        count: { $sum: 1 },
                    } },
                ],
                iosSortedByDate: [
                    { $match: { type: 'app', os: 'ios' } },
                    { $addFields: { m: { $month: '$_created' }, y: { $year: '$_created' } } },
                    { $group: {
                        _id: mode == MONTHLY ? { month: '$m', year: '$y' } : { $dayOfYear: '$_created' },
                        count: { $sum: 1 },
                    } },
                    { $sort: { _id: 1 } },
                ],
                androidValues: [
                    { $match: { type: 'app', os: 'android' } },
                    { $group: {
                        _id: null,
                        count: { $sum: 1 },
                    } },
                ],
                androidSortedByDate: [
                    { $match: { type: 'app', os: 'android' } },
                    { $addFields: { m: { $month: '$_created' }, y: { $year: '$_created' } } },
                    { $group: {
                        _id: mode == MONTHLY ? { month: '$m', year: '$y' } : { $dayOfYear: '$_created' },
                        count: { $sum: 1 },
                    } },
                    { $sort: { _id: 1 } },
                ],
                webValues: [
                    { $match: { type: 'web' } },
                    { $group: {
                        _id: null,
                        count: { $sum: 1 },
                    } },
                ],
                webSortedByDate: [
                    { $match: { type: 'web' } },
                    { $addFields: { m: { $month: '$_created' }, y: { $year: '$_created' } } },
                    { $group: {
                        _id: mode == MONTHLY ? { month: '$m', year: '$y' } : { $dayOfYear: '$_created' },
                        count: { $sum: 1 },
                    } },
                    { $sort: { _id: 1 } },
                ],
            } }
        ])

    ])

    
    let { userValues, sortedByDate } = usersAggregation[0];
    let { iosValues, iosSortedByDate, androidValues, androidSortedByDate, webValues, webSortedByDate } = usageAggregation[0];
    const dateMap = {};
    const dateMapIos = {};
    const dateMapAndroid = {};
    const dateMapWeb = {};
    
    for (let i = 0 ; i < sortedByDate.length; i++)  {
        const date = sortedByDate[i];
        if (mode === MONTHLY) {
            dateMap[`${date._id.month}-${date._id.year}`] = {...date };
        } else {
            dateMap[date._id] = {...date };
        }
    }
    for (let i = 0 ; i < iosSortedByDate.length; i++)  {
        const date = iosSortedByDate[i];
        if (mode === MONTHLY) {
            dateMapIos[`${date._id.month}-${date._id.year}`] = {...date };
        } else {
            dateMapIos[date._id] = {...date };
        }
    }
    for (let i = 0 ; i < androidSortedByDate.length; i++)  {
        const date = androidSortedByDate[i];
        if (mode === MONTHLY) {
            dateMapAndroid[`${date._id.month}-${date._id.year}`] = {...date };
        } else {
            dateMapAndroid[date._id] = {...date };
        }
    }

    console.log('WEB VALUES', webSortedByDate);
    for (let i = 0 ; i < webSortedByDate.length; i++)  {
        const date = webSortedByDate[i];
        if (mode === MONTHLY) {
            dateMapWeb[`${date._id.month}-${date._id.year}`] = {...date };
        } else {
            dateMapWeb[date._id] = {...date };
        }
    }
    
    let startN = Math.abs(start.startOf('year').diff(start,'days').days) +1;
    let endN = Math.abs(start.startOf('year').diff(end, 'days').days) + 1;
    
    if (mode === MONTHLY) {
        startN = 0;
        endN = end.diff(start, 'months').months;
    }
    
    const userCountCollection = [];
    const iosCountCollection = [];
    const androidCountCollection = [];
    const webCountCollection = [];
    
    let startDay = DateTime.local();
    if(startDate) startDay = DateTime.fromFormat(startDate, 'd/L/y');
    
    let days = 0;
    // The problem is here, but it already comes from above
    for (let i = startN; i <= endN; i++) {
        let curValue = dateMap[`${i}`];
        let curValueIos = dateMapIos[`${i}`];
        let curValueAndroid = dateMapAndroid[`${i}`];
        let curValueWeb = dateMapWeb[`${i}`];

        if (mode === DAILY) {
            const current = startDay.plus({ days });
            curValue = dateMap[current.toFormat('o')];
            curValueIos = dateMapIos[current.toFormat('o')];
            curValueAndroid = dateMapAndroid[current.toFormat('o')];
            curValueWeb = dateMapWeb[current.toFormat('o')];
            days++;
        }
        
        if (mode === MONTHLY) {
            curValue = dateMap[start.plus({ months: i }).toFormat('L-y')];
            curValueIos = dateMapIos[start.plus({ months: i }).toFormat('L-y')];
            curValueAndroid = dateMapAndroid[start.plus({ months: i }).toFormat('L-y')];
            curValueWeb = dateMapWeb[start.plus({ months: i }).toFormat('L-y')];
        }
        
        if (curValue == void 0) {
            dateMap[`${i}`] = { count: 0 };
            userCountCollection.push(0);
		} else {
            userCountCollection.push(curValue.count);
		}
        if (curValueIos == void 0) {
            dateMapIos[`${i}`] = { count: 0 };
            iosCountCollection.push(0);
		} else {
            iosCountCollection.push(curValueIos.count);
		}
        if (curValueAndroid == void 0) {
            dateMapAndroid[`${i}`] = { count: 0 };
            androidCountCollection.push(0);
		} else {
            androidCountCollection.push(curValueAndroid.count);
		}
        if (curValueWeb == void 0) {
            dateMapWeb[`${i}`] = { count: 0 };
            webCountCollection.push(0);
		} else {
            webCountCollection.push(curValueWeb.count);
		}
        
    }

    const userCountFormatted = {
        value: userValues.length ? userValues[0].count : 0,
        byDate: userCountCollection,
    }
    const iosCountFormatted = {
        value: iosValues.length ? iosValues[0].count : 0,
        byDate: iosCountCollection,
    }
    const androidCountFormatted = {
        value: androidValues.length ? androidValues[0].count : 0,
        byDate: androidCountCollection,
    }
    const webCountFormatted = {
        value: webValues.length ? webValues[0].count : 0,
        byDate: webCountCollection,
    }

    let formattedResults = {
        userStatistics: userCountFormatted,
        userIOS: iosCountFormatted,
        userAndroid: androidCountFormatted,
        userWeb: webCountFormatted
    };

    return { code: 200, analytics: formattedResults };
};

const getLogs = async (req) => {
    const { body } = req;

    // LOGs Query
    let query = {};
    // Meta Query
    let metaQuery = {};

    if (body.skip && body.skip < 0) body.skip = 0;

    // let query = {};
    if (body.method) {
        metaQuery['meta.req.method'] = { $in: body.method };
    }
    if (body.startDate) {
        if (!query._created) query._created = {};
        query['_created'].$gte = DateTime.fromFormat(body.startDate, 'dd/MM/yyyy')
            .startOf('day')
            .toJSDate();
    }
    if (body.endDate) {
        if (!query._created) query._created = {};
        query['_created'].$lte = DateTime.fromFormat(body.endDate, 'dd/MM/yyyy')
            .endOf('day')
            .toJSDate();
    }

    if (body.token) {
        query['token'] = { $regex: body.token };
    }

    if (body.userId) {
        query['userId'] = { $regex: body.userId };
    }

    if (body.code && body.code.length) {
        const { code } = body;
        if (code.constructor === Array) {
            let codeQueries = [];
            for (const c of code) {
                codeQueries.push({ code: { $gte: Number(`${c}00`), $lte: Number(`${c}99`) } } );
            }
            query.$or = codeQueries;
        } else {
            query['code'] = { $gte: Number(`${code}00`), $lte: Number(`${code}99`) };
        }
    }

    if (body.source && body.source !== 'all') {
        query['source'] = body.source;

        if (Array.isArray(body.source)) {
            query['source'] = { $in: body.source };
        }
    }

    if (body.url) {
        metaQuery['meta.req.originalUrl'] = { $regex: body.url };
    }

    const logs = await Log.aggregate([
        { $match: query },
        { $lookup: {
            from: Meta.collection.name,
            localField: 'meta',
            foreignField: '_id',
            as: 'meta',
        } },
        { $match: metaQuery },
        { $unwind: '$meta' },
        { $facet: {
            total: [
                { $group: { _id: null, count: { $sum: 1 } } },
                { $project: { _id: 0 } }
            ],
            logs: [{ $sort: { _created: -1 } }, { $skip: Number(body.skip) * Number(body.limit) }, { $limit: Number(body.limit) }]
        } },
        { $addFields: { total: { $arrayElemAt: ['$total.count', 0] } } },
    ]);

    return { code: 207, ...logs[0] };
}

//Router
const statisticsRouter = errorHandler => {
    const router = express.Router();
    router
        .get('/dashboard', checkToken(), checkRole('sysadmin', 'owner', 'admin'), errorHandler(async (req, res, next) => {
            const { code, analytics } = await getDashboard(req,res,next);
            response(req, res, code, 'DASHBOARD_FOUND', 'Dashboard found', { analytics });
        }))

        .post('/logs/?', checkToken(), checkRole('sysadmin'), errorHandler(async (req, res, next) => {
            const { code, logs, total } = await getLogs(req,res,next);
            response(req, res, code, 'LOGS_FOUND', 'Found Logs', { logs, total });
        }));
    return router;
};

export const router = statisticsRouter;