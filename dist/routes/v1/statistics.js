"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = void 0;

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _luxon = require("luxon");

var _database = require("../../utils/database");

var _index = require("./index");

var _misc = require("../../utils/misc");

var _errors = _interopRequireDefault(require("../../utils/errors"));

var _user = _interopRequireDefault(require("../../models/user"));

var _statistic = _interopRequireDefault(require("../../models/statistic"));

var _log = _interopRequireDefault(require("../../models/log"));

var _meta = _interopRequireDefault(require("../../models/meta"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var DAILY = 'daily';
var MONTHLY = 'monthly';
var ObjectId = _database.mongoose.Types.ObjectId;

var getDashboard = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req) {
    var _req$query, startDate, endDate, source, start, end, diff, mode, _yield$Promise$all, _yield$Promise$all2, usersAggregation, usageAggregation, _usersAggregation$, userValues, sortedByDate, _usageAggregation$, iosValues, iosSortedByDate, androidValues, androidSortedByDate, webValues, webSortedByDate, dateMap, dateMapIos, dateMapAndroid, dateMapWeb, i, date, _i2, _date, _i3, _date2, _i4, _date3, startN, endN, userCountCollection, iosCountCollection, androidCountCollection, webCountCollection, startDay, days, _i5, curValue, curValueIos, curValueAndroid, curValueWeb, current, userCountFormatted, iosCountFormatted, androidCountFormatted, webCountFormatted, formattedResults;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$query = req.query, startDate = _req$query.startDate, endDate = _req$query.endDate, source = req.headers.source;

            if (!(source != 'bo')) {
              _context.next = 3;
              break;
            }

            throw _errors["default"].no_permission;

          case 3:
            // Preparing dates
            start = _luxon.DateTime.local(), end = _luxon.DateTime.local();
            if (startDate) start = _luxon.DateTime.fromFormat(startDate, 'd/L/y');
            if (endDate) end = _luxon.DateTime.fromFormat(endDate, 'd/L/y');
            diff = end.diff(start, 'days').days;

            if (!(diff < 0)) {
              _context.next = 9;
              break;
            }

            throw _errors["default"].bad_request;

          case 9:
            // Verifying form of grouping data
            mode = MONTHLY;

            if (diff <= 90) {
              mode = DAILY;
            }

            _context.next = 13;
            return Promise.all([_user["default"].aggregate([{
              $match: {
                confirmationDate: {
                  $gte: start.startOf('day').toJSDate(),
                  $lte: end.endOf('day').toJSDate()
                }
              }
            }, {
              $facet: {
                userValues: [{
                  $group: {
                    _id: null,
                    count: {
                      $sum: 1
                    }
                  }
                }],
                sortedByDate: [{
                  $addFields: {
                    m: {
                      $month: '$_created'
                    },
                    y: {
                      $year: '$_created'
                    }
                  }
                }, {
                  $group: {
                    _id: mode == MONTHLY ? {
                      month: '$m',
                      year: '$y'
                    } : {
                      $dayOfYear: '$_created'
                    },
                    count: {
                      $sum: 1
                    }
                  }
                }, {
                  $sort: {
                    _id: 1
                  }
                }]
              }
            }]), _statistic["default"].aggregate([{
              $match: {
                date: {
                  $gte: start.startOf('day').toJSDate(),
                  $lte: end.endOf('day').toJSDate()
                }
              }
            }, {
              $facet: {
                iosValues: [{
                  $match: {
                    type: 'app',
                    os: 'ios'
                  }
                }, {
                  $group: {
                    _id: null,
                    count: {
                      $sum: 1
                    }
                  }
                }],
                iosSortedByDate: [{
                  $match: {
                    type: 'app',
                    os: 'ios'
                  }
                }, {
                  $addFields: {
                    m: {
                      $month: '$_created'
                    },
                    y: {
                      $year: '$_created'
                    }
                  }
                }, {
                  $group: {
                    _id: mode == MONTHLY ? {
                      month: '$m',
                      year: '$y'
                    } : {
                      $dayOfYear: '$_created'
                    },
                    count: {
                      $sum: 1
                    }
                  }
                }, {
                  $sort: {
                    _id: 1
                  }
                }],
                androidValues: [{
                  $match: {
                    type: 'app',
                    os: 'android'
                  }
                }, {
                  $group: {
                    _id: null,
                    count: {
                      $sum: 1
                    }
                  }
                }],
                androidSortedByDate: [{
                  $match: {
                    type: 'app',
                    os: 'android'
                  }
                }, {
                  $addFields: {
                    m: {
                      $month: '$_created'
                    },
                    y: {
                      $year: '$_created'
                    }
                  }
                }, {
                  $group: {
                    _id: mode == MONTHLY ? {
                      month: '$m',
                      year: '$y'
                    } : {
                      $dayOfYear: '$_created'
                    },
                    count: {
                      $sum: 1
                    }
                  }
                }, {
                  $sort: {
                    _id: 1
                  }
                }],
                webValues: [{
                  $match: {
                    type: 'web'
                  }
                }, {
                  $group: {
                    _id: null,
                    count: {
                      $sum: 1
                    }
                  }
                }],
                webSortedByDate: [{
                  $match: {
                    type: 'web'
                  }
                }, {
                  $addFields: {
                    m: {
                      $month: '$_created'
                    },
                    y: {
                      $year: '$_created'
                    }
                  }
                }, {
                  $group: {
                    _id: mode == MONTHLY ? {
                      month: '$m',
                      year: '$y'
                    } : {
                      $dayOfYear: '$_created'
                    },
                    count: {
                      $sum: 1
                    }
                  }
                }, {
                  $sort: {
                    _id: 1
                  }
                }]
              }
            }])]);

          case 13:
            _yield$Promise$all = _context.sent;
            _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
            usersAggregation = _yield$Promise$all2[0];
            usageAggregation = _yield$Promise$all2[1];
            _usersAggregation$ = usersAggregation[0], userValues = _usersAggregation$.userValues, sortedByDate = _usersAggregation$.sortedByDate;
            _usageAggregation$ = usageAggregation[0], iosValues = _usageAggregation$.iosValues, iosSortedByDate = _usageAggregation$.iosSortedByDate, androidValues = _usageAggregation$.androidValues, androidSortedByDate = _usageAggregation$.androidSortedByDate, webValues = _usageAggregation$.webValues, webSortedByDate = _usageAggregation$.webSortedByDate;
            dateMap = {};
            dateMapIos = {};
            dateMapAndroid = {};
            dateMapWeb = {};

            for (i = 0; i < sortedByDate.length; i++) {
              date = sortedByDate[i];

              if (mode === MONTHLY) {
                dateMap["".concat(date._id.month, "-").concat(date._id.year)] = _objectSpread({}, date);
              } else {
                dateMap[date._id] = _objectSpread({}, date);
              }
            }

            for (_i2 = 0; _i2 < iosSortedByDate.length; _i2++) {
              _date = iosSortedByDate[_i2];

              if (mode === MONTHLY) {
                dateMapIos["".concat(_date._id.month, "-").concat(_date._id.year)] = _objectSpread({}, _date);
              } else {
                dateMapIos[_date._id] = _objectSpread({}, _date);
              }
            }

            for (_i3 = 0; _i3 < androidSortedByDate.length; _i3++) {
              _date2 = androidSortedByDate[_i3];

              if (mode === MONTHLY) {
                dateMapAndroid["".concat(_date2._id.month, "-").concat(_date2._id.year)] = _objectSpread({}, _date2);
              } else {
                dateMapAndroid[_date2._id] = _objectSpread({}, _date2);
              }
            }

            console.log('WEB VALUES', webSortedByDate);

            for (_i4 = 0; _i4 < webSortedByDate.length; _i4++) {
              _date3 = webSortedByDate[_i4];

              if (mode === MONTHLY) {
                dateMapWeb["".concat(_date3._id.month, "-").concat(_date3._id.year)] = _objectSpread({}, _date3);
              } else {
                dateMapWeb[_date3._id] = _objectSpread({}, _date3);
              }
            }

            startN = Math.abs(start.startOf('year').diff(start, 'days').days) + 1;
            endN = Math.abs(start.startOf('year').diff(end, 'days').days) + 1;

            if (mode === MONTHLY) {
              startN = 0;
              endN = end.diff(start, 'months').months;
            }

            userCountCollection = [];
            iosCountCollection = [];
            androidCountCollection = [];
            webCountCollection = [];
            startDay = _luxon.DateTime.local();
            if (startDate) startDay = _luxon.DateTime.fromFormat(startDate, 'd/L/y');
            days = 0; // The problem is here, but it already comes from above

            for (_i5 = startN; _i5 <= endN; _i5++) {
              curValue = dateMap["".concat(_i5)];
              curValueIos = dateMapIos["".concat(_i5)];
              curValueAndroid = dateMapAndroid["".concat(_i5)];
              curValueWeb = dateMapWeb["".concat(_i5)];

              if (mode === DAILY) {
                current = startDay.plus({
                  days: days
                });
                curValue = dateMap[current.toFormat('o')];
                curValueIos = dateMapIos[current.toFormat('o')];
                curValueAndroid = dateMapAndroid[current.toFormat('o')];
                curValueWeb = dateMapWeb[current.toFormat('o')];
                days++;
              }

              if (mode === MONTHLY) {
                curValue = dateMap[start.plus({
                  months: _i5
                }).toFormat('L-y')];
                curValueIos = dateMapIos[start.plus({
                  months: _i5
                }).toFormat('L-y')];
                curValueAndroid = dateMapAndroid[start.plus({
                  months: _i5
                }).toFormat('L-y')];
                curValueWeb = dateMapWeb[start.plus({
                  months: _i5
                }).toFormat('L-y')];
              }

              if (curValue == void 0) {
                dateMap["".concat(_i5)] = {
                  count: 0
                };
                userCountCollection.push(0);
              } else {
                userCountCollection.push(curValue.count);
              }

              if (curValueIos == void 0) {
                dateMapIos["".concat(_i5)] = {
                  count: 0
                };
                iosCountCollection.push(0);
              } else {
                iosCountCollection.push(curValueIos.count);
              }

              if (curValueAndroid == void 0) {
                dateMapAndroid["".concat(_i5)] = {
                  count: 0
                };
                androidCountCollection.push(0);
              } else {
                androidCountCollection.push(curValueAndroid.count);
              }

              if (curValueWeb == void 0) {
                dateMapWeb["".concat(_i5)] = {
                  count: 0
                };
                webCountCollection.push(0);
              } else {
                webCountCollection.push(curValueWeb.count);
              }
            }

            userCountFormatted = {
              value: userValues.length ? userValues[0].count : 0,
              byDate: userCountCollection
            };
            iosCountFormatted = {
              value: iosValues.length ? iosValues[0].count : 0,
              byDate: iosCountCollection
            };
            androidCountFormatted = {
              value: androidValues.length ? androidValues[0].count : 0,
              byDate: androidCountCollection
            };
            webCountFormatted = {
              value: webValues.length ? webValues[0].count : 0,
              byDate: webCountCollection
            };
            formattedResults = {
              userStatistics: userCountFormatted,
              userIOS: iosCountFormatted,
              userAndroid: androidCountFormatted,
              userWeb: webCountFormatted
            };
            return _context.abrupt("return", {
              code: 200,
              analytics: formattedResults
            });

          case 45:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getDashboard(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getLogs = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req) {
    var body, query, metaQuery, code, codeQueries, _iterator, _step, c, logs;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            body = req.body; // LOGs Query

            query = {}; // Meta Query

            metaQuery = {};
            if (body.skip && body.skip < 0) body.skip = 0; // let query = {};

            if (body.method) {
              metaQuery['meta.req.method'] = {
                $in: body.method
              };
            }

            if (body.startDate) {
              if (!query._created) query._created = {};
              query['_created'].$gte = _luxon.DateTime.fromFormat(body.startDate, 'dd/MM/yyyy').startOf('day').toJSDate();
            }

            if (body.endDate) {
              if (!query._created) query._created = {};
              query['_created'].$lte = _luxon.DateTime.fromFormat(body.endDate, 'dd/MM/yyyy').endOf('day').toJSDate();
            }

            if (body.token) {
              query['token'] = {
                $regex: body.token
              };
            }

            if (body.userId) {
              query['userId'] = {
                $regex: body.userId
              };
            }

            if (body.code && body.code.length) {
              code = body.code;

              if (code.constructor === Array) {
                codeQueries = [];
                _iterator = _createForOfIteratorHelper(code);

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    c = _step.value;
                    codeQueries.push({
                      code: {
                        $gte: Number("".concat(c, "00")),
                        $lte: Number("".concat(c, "99"))
                      }
                    });
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }

                query.$or = codeQueries;
              } else {
                query['code'] = {
                  $gte: Number("".concat(code, "00")),
                  $lte: Number("".concat(code, "99"))
                };
              }
            }

            if (body.source && body.source !== 'all') {
              query['source'] = body.source;

              if (Array.isArray(body.source)) {
                query['source'] = {
                  $in: body.source
                };
              }
            }

            if (body.url) {
              metaQuery['meta.req.originalUrl'] = {
                $regex: body.url
              };
            }

            _context2.next = 14;
            return _log["default"].aggregate([{
              $match: query
            }, {
              $lookup: {
                from: _meta["default"].collection.name,
                localField: 'meta',
                foreignField: '_id',
                as: 'meta'
              }
            }, {
              $match: metaQuery
            }, {
              $unwind: '$meta'
            }, {
              $facet: {
                total: [{
                  $group: {
                    _id: null,
                    count: {
                      $sum: 1
                    }
                  }
                }, {
                  $project: {
                    _id: 0
                  }
                }],
                logs: [{
                  $sort: {
                    _created: -1
                  }
                }, {
                  $skip: Number(body.skip) * Number(body.limit)
                }, {
                  $limit: Number(body.limit)
                }]
              }
            }, {
              $addFields: {
                total: {
                  $arrayElemAt: ['$total.count', 0]
                }
              }
            }]);

          case 14:
            logs = _context2.sent;
            return _context2.abrupt("return", _objectSpread({
              code: 207
            }, logs[0]));

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getLogs(_x2) {
    return _ref2.apply(this, arguments);
  };
}(); //Router


var statisticsRouter = function statisticsRouter(errorHandler) {
  var router = _express["default"].Router();

  router.get('/dashboard', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
      var _yield$getDashboard, code, analytics;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return getDashboard(req, res, next);

            case 2:
              _yield$getDashboard = _context3.sent;
              code = _yield$getDashboard.code;
              analytics = _yield$getDashboard.analytics;
              (0, _misc.response)(req, res, code, 'DASHBOARD_FOUND', 'Dashboard found', {
                analytics: analytics
              });

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x3, _x4, _x5) {
      return _ref3.apply(this, arguments);
    };
  }())).post('/logs/?', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin'), errorHandler( /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
      var _yield$getLogs, code, logs, total;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return getLogs(req, res, next);

            case 2:
              _yield$getLogs = _context4.sent;
              code = _yield$getLogs.code;
              logs = _yield$getLogs.logs;
              total = _yield$getLogs.total;
              (0, _misc.response)(req, res, code, 'LOGS_FOUND', 'Found Logs', {
                logs: logs,
                total: total
              });

            case 7:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x6, _x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  }()));
  return router;
};

var router = statisticsRouter;
exports.router = router;