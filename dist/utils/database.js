"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
Object.defineProperty(exports, "mongoose", {
  enumerable: true,
  get: function get() {
    return _mongoose["default"];
  }
});

var _mongoose = _interopRequireDefault(require("mongoose"));

var _regeneratorRuntime = _interopRequireDefault(require("regenerator-runtime"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//YOU SHOULD NOT DELETE THIS LINE!!!!
var debug = process.env.LOGS_DB === 'true' ? true : false;

_mongoose["default"].set('debug', debug);

_mongoose["default"].set('useNewUrlParser', true);

_mongoose["default"].set('useFindAndModify', false);

_mongoose["default"].set('runValidators', true);

_mongoose["default"].set('useCreateIndex', true);

_mongoose["default"].set('useUnifiedTopology', true);

var dbConnection = null;

dbConnection = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime["default"].mark(function _callee() {
    return _regeneratorRuntime["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _mongoose["default"].connect("mongodb://".concat(process.env.DATABASE_USERNAME, ":").concat(process.env.DATABASE_PASSWORD, "@").concat(process.env.DATABASE_IP, ":").concat(process.env.DATABASE_PORT, "/").concat(process.env.DATABASE));

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function dbConnection() {
    return _ref.apply(this, arguments);
  };
}();

var _default = dbConnection;
exports["default"] = _default;