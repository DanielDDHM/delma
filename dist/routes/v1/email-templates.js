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

var _emailTemplate = _interopRequireDefault(require("../../models/emailTemplate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getEmailTemplate = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req) {
    var id, emailTemplate;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = req.params.id;
            emailTemplate = [];

            if (!id) {
              _context.next = 10;
              break;
            }

            _context.next = 5;
            return _emailTemplate["default"].findOne({
              _id: id
            });

          case 5:
            emailTemplate = _context.sent;

            if (emailTemplate) {
              _context.next = 8;
              break;
            }

            throw _errors["default"].not_found;

          case 8:
            _context.next = 13;
            break;

          case 10:
            _context.next = 12;
            return _emailTemplate["default"].aggregate([{
              $project: {
                key: 1
              }
            }]);

          case 12:
            emailTemplate = _context.sent;

          case 13:
            return _context.abrupt("return", {
              code: 200,
              emailTemplate: emailTemplate
            });

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getEmailTemplate(_x) {
    return _ref.apply(this, arguments);
  };
}();

var putEmailTemplate = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req) {
    var id, body, emailTemplate;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.params.id, body = req.body;
            console.log("BODY", body);

            if (!(!body.key || !body.subject)) {
              _context2.next = 4;
              break;
            }

            throw _errors["default"].required_fields_empty;

          case 4:
            _context2.next = 6;
            return _emailTemplate["default"].updateOne({
              _id: id
            }, body, {
              "new": true
            });

          case 6:
            _context2.next = 8;
            return _emailTemplate["default"].find();

          case 8:
            emailTemplate = _context2.sent;
            return _context2.abrupt("return", {
              code: 200,
              emailTemplate: emailTemplate
            });

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function putEmailTemplate(_x2) {
    return _ref2.apply(this, arguments);
  };
}(); //Router


var emailTemplatesRouter = function emailTemplatesRouter(errorHandler) {
  var router = _express["default"].Router();

  router.get('/:id?', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
      var _yield$getEmailTempla, code, emailTemplate;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return getEmailTemplate(req, res, next);

            case 2:
              _yield$getEmailTempla = _context3.sent;
              code = _yield$getEmailTempla.code;
              emailTemplate = _yield$getEmailTempla.emailTemplate;
              (0, _misc.response)(req, res, code, 'EMAIL_TEMPLATE_FOUND', 'Email Template found', {
                emailTemplate: emailTemplate
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
  }())).put('/:id', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
      var _yield$putEmailTempla, code, emailTemplate;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return putEmailTemplate(req, res, next);

            case 2:
              _yield$putEmailTempla = _context4.sent;
              code = _yield$putEmailTempla.code;
              emailTemplate = _yield$putEmailTempla.emailTemplate;
              (0, _misc.response)(req, res, code, 'EMAIL_TEMPLATE_UPDATED', 'Email Template has been updated', {
                emailTemplate: emailTemplate
              });

            case 6:
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

var router = emailTemplatesRouter;
exports.router = router;