"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = void 0;

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _index = require("./index");

var _misc = require("../../utils/misc");

var _errors = _interopRequireDefault(require("../../utils/errors"));

var _scheduleNotification = _interopRequireDefault(require("../../models/scheduleNotification"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getScheduleNotification = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req) {
    var id, scheduleNotification;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = req.params.id;

            if (!id) {
              _context.next = 9;
              break;
            }

            _context.next = 4;
            return _scheduleNotification["default"].findOne({
              _id: id
            }).lean();

          case 4:
            scheduleNotification = _context.sent;

            if (scheduleNotification) {
              _context.next = 7;
              break;
            }

            throw _errors["default"].not_found;

          case 7:
            _context.next = 12;
            break;

          case 9:
            _context.next = 11;
            return _scheduleNotification["default"].find().lean();

          case 11:
            scheduleNotification = _context.sent;

          case 12:
            return _context.abrupt("return", {
              code: 200,
              scheduleNotification: scheduleNotification
            });

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getScheduleNotification(_x) {
    return _ref.apply(this, arguments);
  };
}();

var postScheduleNotification = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req) {
    var body, newScheduleNotification, scheduleNotification;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            body = req.body;

            if (!(!body.title || !body.description)) {
              _context2.next = 3;
              break;
            }

            throw _errors["default"].required_fields_empty;

          case 3:
            _context2.next = 5;
            return (0, _scheduleNotification["default"])(body).save();

          case 5:
            newScheduleNotification = _context2.sent;
            _context2.next = 8;
            return _scheduleNotification["default"].findOne({
              _id: newScheduleNotification._id
            }).lean();

          case 8:
            scheduleNotification = _context2.sent;
            return _context2.abrupt("return", {
              code: 200,
              scheduleNotification: scheduleNotification
            });

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function postScheduleNotification(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var putScheduleNotification = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req) {
    var id, body, scheduleNotification;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id, body = req.body;

            if (!(!body.title || !body.description)) {
              _context3.next = 3;
              break;
            }

            throw _errors["default"].required_fields_empty;

          case 3:
            _context3.next = 5;
            return _scheduleNotification["default"].findOneAndUpdate({
              _id: id
            }, body, {
              "new": true
            }).lean();

          case 5:
            scheduleNotification = _context3.sent;
            return _context3.abrupt("return", {
              code: 200,
              scheduleNotification: scheduleNotification
            });

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function putScheduleNotification(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var deleteScheduleNotification = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req) {
    var id, scheduleNotification;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.params.id;
            _context4.next = 3;
            return _scheduleNotification["default"].deleteOne({
              _id: id
            });

          case 3:
            _context4.next = 5;
            return _scheduleNotification["default"].find().lean();

          case 5:
            scheduleNotification = _context4.sent;
            return _context4.abrupt("return", {
              code: 200,
              scheduleNotification: scheduleNotification
            });

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function deleteScheduleNotification(_x4) {
    return _ref4.apply(this, arguments);
  };
}(); //Router


var scheduleNotificationsRouter = function scheduleNotificationsRouter(errorHandler) {
  var router = _express["default"].Router();

  router.get('/:id?', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res, next) {
      var _yield$getScheduleNot, code, scheduleNotification;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return getScheduleNotification(req, res, next);

            case 2:
              _yield$getScheduleNot = _context5.sent;
              code = _yield$getScheduleNot.code;
              scheduleNotification = _yield$getScheduleNot.scheduleNotification;
              (0, _misc.response)(req, res, code, 'NOTIFICATION_FOUND', 'Schedule Notification found', {
                scheduleNotification: scheduleNotification
              });

            case 6:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x5, _x6, _x7) {
      return _ref5.apply(this, arguments);
    };
  }())).post('/', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res, next) {
      var _yield$postScheduleNo, code, scheduleNotification;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return postScheduleNotification(req, res, next);

            case 2:
              _yield$postScheduleNo = _context6.sent;
              code = _yield$postScheduleNo.code;
              scheduleNotification = _yield$postScheduleNo.scheduleNotification;
              (0, _misc.response)(req, res, code, 'NOTIFICATION_CREATED', 'Schedule Notification has been created', {
                scheduleNotification: scheduleNotification
              });

            case 6:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x8, _x9, _x10) {
      return _ref6.apply(this, arguments);
    };
  }())).put('/:id', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res, next) {
      var _yield$putScheduleNot, code, scheduleNotification;

      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return putScheduleNotification(req, res, next);

            case 2:
              _yield$putScheduleNot = _context7.sent;
              code = _yield$putScheduleNot.code;
              scheduleNotification = _yield$putScheduleNot.scheduleNotification;
              (0, _misc.response)(req, res, code, 'NOTIFICATION_UPDATED', 'Schedule Notification has been updated', {
                scheduleNotification: scheduleNotification
              });

            case 6:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function (_x11, _x12, _x13) {
      return _ref7.apply(this, arguments);
    };
  }()))["delete"]('/:id', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res, next) {
      var _yield$deleteSchedule, code, scheduleNotification;

      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return deleteScheduleNotification(req, res, next);

            case 2:
              _yield$deleteSchedule = _context8.sent;
              code = _yield$deleteSchedule.code;
              scheduleNotification = _yield$deleteSchedule.scheduleNotification;
              (0, _misc.response)(req, res, code, 'NOTIFICATION_DELETED', 'Schedule Notification has been deleted', {
                scheduleNotification: scheduleNotification
              });

            case 6:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));

    return function (_x14, _x15, _x16) {
      return _ref8.apply(this, arguments);
    };
  }()));
  return router;
};

var router = scheduleNotificationsRouter;
exports.router = router;