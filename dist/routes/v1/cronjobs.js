"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = void 0;

var _express = _interopRequireDefault(require("express"));

var _nodeOsUtils = _interopRequireDefault(require("node-os-utils"));

var _webApi = require("@slack/web-api");

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _child_process = require("child_process");

var _luxon = require("luxon");

var _nodeCron = _interopRequireDefault(require("node-cron"));

var _misc = require("../../utils/misc");

var _notifications = require("../../utils/notifications");

var _staff = _interopRequireDefault(require("../../models/staff"));

var _meta = _interopRequireDefault(require("../../models/meta"));

var _log = _interopRequireDefault(require("../../models/log"));

var _user = _interopRequireDefault(require("../../models/user"));

var _scheduleNotification = _interopRequireDefault(require("../../models/scheduleNotification"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getApiStatus = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _staff["default"].findOne({}).lean();

          case 2:
            return _context.abrupt("return", {
              code: 207
            });

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getApiStatus(_x) {
    return _ref.apply(this, arguments);
  };
}();

var serverStatus = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req) {
    var drive, slackToken, conversationId, slack, info;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            drive = _nodeOsUtils["default"].drive;
            slackToken = process.env.SLACK_TOKEN;
            conversationId = process.env.SLACK_CHANNEL;
            slack = new _webApi.WebClient(slackToken);

            if (!(process.env.NODE_ENV === 'prod')) {
              _context2.next = 20;
              break;
            }

            _context2.next = 7;
            return drive.info();

          case 7:
            info = _context2.sent;

            if (!(info.freePercentage < 10)) {
              _context2.next = 20;
              break;
            }

            _context2.prev = 9;

            _fsExtra["default"].emptyDir('/home/ubuntu/.pm2/logs');

            (0, _child_process.exec)('sudo journalctl --vacuum-size=200M', function (error, stdout, stderr) {
              if (error) {
                console.log("error: ".concat(error.message));
                return;
              }

              if (stderr) {
                console.log("stderr: ".concat(stderr));
                return;
              }

              console.log("stdout: ".concat(stdout));
            });
            (0, _child_process.exec)('sudo apt-get autoremove', function (error, stdout, stderr) {
              if (error) {
                console.log("error: ".concat(error.message));
                return;
              }

              if (stderr) {
                console.log("stderr: ".concat(stderr));
                return;
              }

              console.log("stdout: ".concat(stdout));
            });
            _context2.next = 15;
            return slack.chat.postMessage({
              text: "SERVER ALERT - CHECK DISK SPACE BECAUSE IS UNDER 10% BUT THE SERVER WAS ALREADY CLEARED:\n".concat(JSON.stringify(info)),
              channel: conversationId
            });

          case 15:
            _context2.next = 20;
            break;

          case 17:
            _context2.prev = 17;
            _context2.t0 = _context2["catch"](9);
            console.log('ERROR', _context2.t0);

          case 20:
            return _context2.abrupt("return");

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[9, 17]]);
  }));

  return function serverStatus(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var scheduleNotification = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req) {
    var currentDate, _yield$Promise$all, _yield$Promise$all2, library, scheduleNotification;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            currentDate = _luxon.DateTime.utc().toJSDate();
            _context3.next = 3;
            return Promise.all([Library.find({
              publishSchedule: true,
              publishScheduleDate: {
                $lte: currentDate
              },
              published: false
            }).lean(), _scheduleNotification["default"].find({
              scheduleDate: {
                $lte: currentDate
              },
              sent: false
            }).lean()]);

          case 3:
            _yield$Promise$all = _context3.sent;
            _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
            library = _yield$Promise$all2[0];
            scheduleNotification = _yield$Promise$all2[1];
            return _context3.abrupt("return");

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function scheduleNotification(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var manageLogs = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req) {
    var date1, date2;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            date1 = _luxon.DateTime.local().minus({
              days: 7
            }).toUTC().toISO();
            date2 = _luxon.DateTime.local().minus({
              days: 30
            }).toUTC().toISO();
            _context4.next = 4;
            return Promise.all([_meta["default"].deleteMany({
              _created: {
                $lte: date1
              },
              'res.statusCode': {
                $lt: 400
              }
            }), _log["default"].deleteMany({
              _created: {
                $lte: date1
              },
              code: {
                $lt: 400
              }
            }), _meta["default"].deleteMany({
              _created: {
                $lte: date2
              }
            }), _log["default"].deleteMany({
              _created: {
                $lte: date2
              }
            })]);

          case 4:
            return _context4.abrupt("return");

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function manageLogs(_x4) {
    return _ref4.apply(this, arguments);
  };
}(); // cron.schedule('0 9,17 * * *', serverStatus);
// cron.schedule('0 14 * * *', moodWarning);
// cron.schedule('0 2 * * *', manageLogs);
// cron.schedule('* * * * *', scheduleNotification);
//Router


var cronjobsRouter = function cronjobsRouter(errorHandler) {
  var router = _express["default"].Router();

  router.get('/api-status/', errorHandler( /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res, next) {
      var _yield$getApiStatus, code;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return getApiStatus(req, res, next);

            case 2:
              _yield$getApiStatus = _context5.sent;
              code = _yield$getApiStatus.code;
              (0, _misc.response)(req, res, code, 'API STATUS_OK', 'API Status ok');

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x5, _x6, _x7) {
      return _ref5.apply(this, arguments);
    };
  }()));
  return router;
};

var router = cronjobsRouter;
exports.router = router;