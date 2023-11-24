"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = void 0;

var _express = _interopRequireDefault(require("express"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _lodash = _interopRequireDefault(require("lodash"));

var _generatePassword = _interopRequireDefault(require("generate-password"));

var _luxon = require("luxon");

var _index = require("./index");

var _misc = require("../../utils/misc");

var _upload = require("../../utils/upload");

var _email = require("../../utils/email");

var _errors = _interopRequireDefault(require("../../utils/errors"));

var _config = _interopRequireDefault(require("../../utils/config"));

var _staff2 = _interopRequireDefault(require("../../models/staff"));

var _token = _interopRequireDefault(require("../../models/token"));

var _invite2 = _interopRequireDefault(require("../../models/invite"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var postStaff = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var body, user, staff, code, newStaff, invite, allStaff;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            body = req.body, user = req.user;
            console.log("BODY", body);
            console.log('user', user);

            if (!(user.role != 'owner' && user.role != 'sysadmin')) {
              _context.next = 5;
              break;
            }

            throw _errors["default"].no_permission;

          case 5:
            _context.next = 7;
            return _staff2["default"].findOne({
              email: body.email
            });

          case 7:
            staff = _context.sent;
            console.log("STAFF", staff);
            code = Math.floor(Math.random() * 9000) + 1000;

            if (staff) {
              _context.next = 18;
              break;
            }

            newStaff = new _staff2["default"]({
              email: body.email,
              name: body.name,
              role: body.role,
              photo: null
            });
            console.log("NEW STAFF", newStaff);
            _context.next = 15;
            return newStaff.save();

          case 15:
            newStaff = _context.sent;
            _context.next = 21;
            break;

          case 18:
            _context.next = 20;
            return _staff2["default"].findOneAndUpdate({
              _id: staff._id
            }, {
              role: body.role
            }, {
              "new": true
            });

          case 20:
            newStaff = _context.sent;

          case 21:
            _context.next = 23;
            return (0, _invite2["default"])({
              staff: newStaff._id,
              from: user._id,
              invitationCode: code
            }).save();

          case 23:
            invite = _context.sent;
            _context.next = 26;
            return (0, _email.sendEmail)(_config["default"].keyEmails.confirmStaffLink, null, _objectSpread(_objectSpread({}, _config["default"].emailTags), {}, {
              staff_name: user.name,
              staff_email: user.email,
              link: "".concat(process.env.BO_URL, "/accept-invite/").concat(invite._id, "/").concat(code)
            }), newStaff.email);

          case 26:
            _context.next = 28;
            return _staff2["default"].find();

          case 28:
            allStaff = _context.sent;
            return _context.abrupt("return", {
              code: 201,
              staff: allStaff
            });

          case 30:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function postStaff(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var postRecoverPasswordStaff = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var body, params, codeParams, staff, resetCode, _staff;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            body = req.body, params = req.params;
            codeParams = params.code;

            if (codeParams) {
              _context2.next = 17;
              break;
            }

            _context2.next = 5;
            return _staff2["default"].findOne({
              email: body.email
            });

          case 5:
            staff = _context2.sent;
            console.log("STAFF", staff);

            if (staff) {
              _context2.next = 9;
              break;
            }

            return _context2.abrupt("return", {
              code: 200
            });

          case 9:
            resetCode = Math.floor(Math.random() * 9000) + 1000;
            _context2.next = 12;
            return _staff2["default"].updateOne({
              _id: staff._id
            }, {
              $set: {
                resetCode: resetCode
              }
            });

          case 12:
            _context2.next = 14;
            return (0, _email.sendEmail)(_config["default"].keyEmails.recoverStaffLink, null, _objectSpread(_objectSpread({}, _config["default"].emailTags), {}, {
              link: "".concat(process.env.BO_URL, "/recover-password/").concat(staff._id, "/").concat(resetCode)
            }), staff.email);

          case 14:
            return _context2.abrupt("return", {
              code: 200
            });

          case 17:
            _context2.next = 19;
            return _staff2["default"].findOneAndUpdate({
              resetCode: codeParams,
              _id: body._id
            }, {
              confirmed: true,
              password: _bcrypt["default"].hashSync(body.password, 10),
              resetCode: null
            }, {
              "new": true
            });

          case 19:
            _staff = _context2.sent;

            if (_staff) {
              _context2.next = 22;
              break;
            }

            throw _errors["default"].invalid_credentials;

          case 22:
            return _context2.abrupt("return", {
              code: 200
            });

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function postRecoverPasswordStaff(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

var putStaff = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
    var body, params, user, staff, updatedStaff;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            body = req.body, params = req.params, user = req.user;
            _context3.next = 3;
            return _staff2["default"].findOne({
              _id: params.id
            });

          case 3:
            staff = _context3.sent;

            if (staff) {
              _context3.next = 6;
              break;
            }

            throw _errors["default"].not_found;

          case 6:
            if (!(params.id != user._id && user.role != 'owner' && user.role != 'sysadmin')) {
              _context3.next = 8;
              break;
            }

            throw _errors["default"].no_permission;

          case 8:
            if (!(body.filesToDelete && body.filesToDelete.length)) {
              _context3.next = 12;
              break;
            }

            _context3.next = 11;
            return (0, _upload.deleteImage)(body.filesToDelete[0], 'staff');

          case 11:
            body.photo = null;

          case 12:
            if (!(body.files && body.files.length)) {
              _context3.next = 17;
              break;
            }

            if (!body.files) {
              _context3.next = 17;
              break;
            }

            _context3.next = 16;
            return (0, _upload.uploadImage)(body.files[0], 'staff');

          case 16:
            body.photo = _context3.sent;

          case 17:
            console.log("body", body);
            _context3.next = 20;
            return _staff2["default"].findOneAndUpdate({
              _id: params.id
            }, body, {
              fields: '-password',
              "new": true
            });

          case 20:
            updatedStaff = _context3.sent;
            return _context3.abrupt("return", {
              code: 200,
              staff: updatedStaff
            });

          case 22:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function putStaff(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

var putStaffPassword = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
    var body, user, staff, newPassword;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            body = req.body, user = req.user;
            _context4.next = 3;
            return _staff2["default"].findOne({
              _id: user._id
            });

          case 3:
            staff = _context4.sent;

            if (!(!staff || !staff.comparePassword(body.password))) {
              _context4.next = 6;
              break;
            }

            throw _errors["default"].invalid_credentials;

          case 6:
            newPassword = _bcrypt["default"].hashSync(body.newPassword, 10);
            _context4.next = 9;
            return _staff2["default"].updateOne({
              _id: staff._id
            }, {
              password: newPassword
            }, {
              fields: '-password',
              "new": true
            });

          case 9:
            return _context4.abrupt("return", {
              code: 200
            });

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function putStaffPassword(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

var getStaff = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res, next) {
    var id, user, staff, userId;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            id = req.params.id, user = req.user;

            if (!id) {
              _context5.next = 8;
              break;
            }

            userId = id === 'me' ? user._id : id;
            _context5.next = 5;
            return _staff2["default"].findOne({
              _id: userId
            }, '-password').lean();

          case 5:
            staff = _context5.sent;
            _context5.next = 11;
            break;

          case 8:
            _context5.next = 10;
            return _staff2["default"].find().select({
              _id: 1,
              name: 1,
              email: 1,
              photo: 1,
              confirmed: 1,
              role: 1,
              isActive: 1,
              isConfirmed: 1
            });

          case 10:
            staff = _context5.sent;

          case 11:
            return _context5.abrupt("return", {
              code: 200,
              staff: staff
            });

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function getStaff(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

var getInvites = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req) {
    var _req$params, id, invitationCode, invite;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _req$params = req.params, id = _req$params.id, invitationCode = _req$params.invitationCode;

            if (!(id === 'undefined' || id == null)) {
              _context6.next = 3;
              break;
            }

            throw _errors["default"].bad_request;

          case 3:
            _context6.next = 5;
            return _invite2["default"].findOne({
              _id: id,
              invitationCode: invitationCode
            }).populate('staff from');

          case 5:
            invite = _context6.sent;
            return _context6.abrupt("return", {
              code: 200,
              invite: invite
            });

          case 7:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function getInvites(_x16) {
    return _ref6.apply(this, arguments);
  };
}();

var patchResendInvite = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res, next) {
    var id, user, invite, code, _invite, staff;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            id = req.params.id, user = req.user;
            _context7.next = 3;
            return _invite2["default"].findOne({
              staff: id
            }).populate('staff from');

          case 3:
            invite = _context7.sent;

            if (!invite) {
              _context7.next = 9;
              break;
            }

            _context7.next = 7;
            return (0, _email.sendEmail)(_config["default"].keyEmails.confirmStaffLink, null, _objectSpread(_objectSpread({}, _config["default"].emailTags), {}, {
              staff_name: invite.from.name,
              staff_email: invite.from.email,
              link: "".concat(process.env.BO_URL, "/accept-invite/").concat(invite._id, "/").concat(invite.invitationCode)
            }), invite.staff.email);

          case 7:
            _context7.next = 15;
            break;

          case 9:
            code = Math.floor(Math.random() * 9000) + 1000;
            _context7.next = 12;
            return (0, _invite2["default"])({
              staff: id,
              from: user._id,
              invitationCode: code
            }).save();

          case 12:
            _invite = _context7.sent;
            _context7.next = 15;
            return (0, _email.sendEmail)(_config["default"].keyEmails.confirmStaffLink, null, _objectSpread(_objectSpread({}, _config["default"].emailTags), {}, {
              staff_name: user.name,
              staff_email: user.email,
              link: "".concat(process.env.BO_URL, "/accept-invite/").concat(_invite._id, "/").concat(_invite.invitationCode)
            }), _invite.staff.email);

          case 15:
            _context7.next = 17;
            return _staff2["default"].find({}, '-password');

          case 17:
            staff = _context7.sent;
            return _context7.abrupt("return", {
              code: 200,
              staff: staff
            });

          case 19:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function patchResendInvite(_x17, _x18, _x19) {
    return _ref7.apply(this, arguments);
  };
}();

var patchActiveStaff = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res, next) {
    var id, body, staff;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            id = req.params.id;
            body = req.body;

            if (!('isActive' in body)) {
              _context8.next = 7;
              break;
            }

            _context8.next = 5;
            return _staff2["default"].updateOne({
              _id: id
            }, {
              isActive: body.isActive
            });

          case 5:
            _context8.next = 8;
            break;

          case 7:
            throw _errors["default"].required_fields_empty;

          case 8:
            _context8.next = 10;
            return _staff2["default"].find({}, '-password');

          case 10:
            staff = _context8.sent;
            return _context8.abrupt("return", {
              code: 200,
              staff: staff
            });

          case 12:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function patchActiveStaff(_x20, _x21, _x22) {
    return _ref8.apply(this, arguments);
  };
}();

var deleteStaff = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res, next) {
    var id, allStaff;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            id = req.params.id;
            _context9.next = 3;
            return _staff2["default"].deleteOne({
              _id: id
            });

          case 3:
            _context9.next = 5;
            return _staff2["default"].find({}, '-password');

          case 5:
            allStaff = _context9.sent;
            return _context9.abrupt("return", {
              code: 200,
              staff: allStaff
            });

          case 7:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function deleteStaff(_x23, _x24, _x25) {
    return _ref9.apply(this, arguments);
  };
}();

var postConfirmStaff = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req, res, next) {
    var body, invite, staff, password, token, newToken;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            body = req.body;

            if (body.invite) {
              _context10.next = 3;
              break;
            }

            throw _errors["default"].invalid_parameter;

          case 3:
            _context10.next = 5;
            return _invite2["default"].findOne({
              _id: body.invite,
              invitationCode: body.invitationCode
            });

          case 5:
            invite = _context10.sent;

            if (!(!invite || !invite.staff._id || !invite.from._id)) {
              _context10.next = 8;
              break;
            }

            throw _errors["default"].invalid_parameter;

          case 8:
            _context10.next = 10;
            return _staff2["default"].findOne({
              _id: invite.staff._id
            });

          case 10:
            staff = _context10.sent;

            if (!body.password) {
              _context10.next = 15;
              break;
            }

            password = _bcrypt["default"].hashSync(body.password, 10);
            _context10.next = 15;
            return _staff2["default"].updateOne({
              _id: invite.staff._id
            }, {
              password: password,
              isConfirmed: true
            });

          case 15:
            _context10.next = 17;
            return _invite2["default"].findOneAndDelete({
              _id: invite._id
            });

          case 17:
            token = _generatePassword["default"].generateMultiple(2, {
              length: 30,
              numbers: true
            }).toString().replace(',', '.');
            newToken = new _token["default"]({
              staff: staff._id,
              authToken: token,
              dateExpired: _luxon.DateTime.utc().plus({
                days: _config["default"].tokenDuration
              }).toISO()
            });
            _context10.next = 21;
            return newToken.save();

          case 21:
            return _context10.abrupt("return", {
              code: 200,
              staff: staff,
              token: token
            });

          case 22:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function postConfirmStaff(_x26, _x27, _x28) {
    return _ref10.apply(this, arguments);
  };
}(); //Router


var staffRouter = function staffRouter(errorHandler) {
  var router = _express["default"].Router();

  router.get('/:id?', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(req, res, next) {
      var _yield$getStaff, code, staff;

      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return getStaff(req, res, next);

            case 2:
              _yield$getStaff = _context11.sent;
              code = _yield$getStaff.code;
              staff = _yield$getStaff.staff;
              (0, _misc.response)(req, res, code, 'STAFF_FOUND', 'Staff found', {
                staff: staff
              });

            case 6:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));

    return function (_x29, _x30, _x31) {
      return _ref11.apply(this, arguments);
    };
  }())).get('/invite/:id/code/:invitationCode', errorHandler( /*#__PURE__*/function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(req, res, next) {
      var _yield$getInvites, code, invite;

      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return getInvites(req);

            case 2:
              _yield$getInvites = _context12.sent;
              code = _yield$getInvites.code;
              invite = _yield$getInvites.invite;
              (0, _misc.response)(req, res, code, 'INVITE_FOUND', 'Invite Found', {
                invite: invite
              });

            case 6:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }));

    return function (_x32, _x33, _x34) {
      return _ref12.apply(this, arguments);
    };
  }())).post('/', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner'), errorHandler( /*#__PURE__*/function () {
    var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(req, res, next) {
      var _yield$postStaff, code, staff;

      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return postStaff(req, res, next);

            case 2:
              _yield$postStaff = _context13.sent;
              code = _yield$postStaff.code;
              staff = _yield$postStaff.staff;
              (0, _misc.response)(req, res, code, 'STAFF_CREATED', 'Staff has been created', {
                staff: staff
              });

            case 6:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    }));

    return function (_x35, _x36, _x37) {
      return _ref13.apply(this, arguments);
    };
  }())).post('/recover-password/:code?', errorHandler( /*#__PURE__*/function () {
    var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(req, res, next) {
      var _yield$postRecoverPas, code;

      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return postRecoverPasswordStaff(req, res, next);

            case 2:
              _yield$postRecoverPas = _context14.sent;
              code = _yield$postRecoverPas.code;
              (0, _misc.response)(req, res, code, 'PASSWORD_RESET', 'Staff password reset', {});

            case 5:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    }));

    return function (_x38, _x39, _x40) {
      return _ref14.apply(this, arguments);
    };
  }())).post('/confirm/', errorHandler( /*#__PURE__*/function () {
    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(req, res, next) {
      var _yield$postConfirmSta, code, staff, token;

      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return postConfirmStaff(req, res, next);

            case 2:
              _yield$postConfirmSta = _context15.sent;
              code = _yield$postConfirmSta.code;
              staff = _yield$postConfirmSta.staff;
              token = _yield$postConfirmSta.token;
              (0, _misc.response)(req, res, code, 'STAFF_CONFIRMED', 'Staff has been confirmed', {
                staff: staff,
                token: token
              });

            case 7:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    }));

    return function (_x41, _x42, _x43) {
      return _ref15.apply(this, arguments);
    };
  }())).put('/password/', (0, _index.checkToken)(), errorHandler( /*#__PURE__*/function () {
    var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(req, res, next) {
      var _yield$putStaffPasswo, code;

      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return putStaffPassword(req, res, next);

            case 2:
              _yield$putStaffPasswo = _context16.sent;
              code = _yield$putStaffPasswo.code;
              (0, _misc.response)(req, res, code, 'STAFF_UPDATED', 'Staff has been updated');

            case 5:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    }));

    return function (_x44, _x45, _x46) {
      return _ref16.apply(this, arguments);
    };
  }())).put('/:id', (0, _index.checkToken)(), (0, _index.formDataParser)(), errorHandler( /*#__PURE__*/function () {
    var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(req, res, next) {
      var _yield$putStaff, code, staff;

      return regeneratorRuntime.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return putStaff(req, res, next);

            case 2:
              _yield$putStaff = _context17.sent;
              code = _yield$putStaff.code;
              staff = _yield$putStaff.staff;
              (0, _misc.response)(req, res, code, 'STAFF_UPDATED', 'Staff has been updated', {
                staff: staff
              });

            case 6:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17);
    }));

    return function (_x47, _x48, _x49) {
      return _ref17.apply(this, arguments);
    };
  }())).patch('/resend-invite/:id', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner'), errorHandler( /*#__PURE__*/function () {
    var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(req, res, next) {
      var _yield$patchResendInv, code, staff;

      return regeneratorRuntime.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return patchResendInvite(req, res, next);

            case 2:
              _yield$patchResendInv = _context18.sent;
              code = _yield$patchResendInv.code;
              staff = _yield$patchResendInv.staff;
              (0, _misc.response)(req, res, code, 'INVITE_RESENTED', 'Staff Invite has been resented', {
                staff: staff
              });

            case 6:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18);
    }));

    return function (_x50, _x51, _x52) {
      return _ref18.apply(this, arguments);
    };
  }())).patch('/:id', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner'), errorHandler( /*#__PURE__*/function () {
    var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(req, res, next) {
      var _yield$patchActiveSta, code, staff;

      return regeneratorRuntime.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              _context19.next = 2;
              return patchActiveStaff(req, res, next);

            case 2:
              _yield$patchActiveSta = _context19.sent;
              code = _yield$patchActiveSta.code;
              staff = _yield$patchActiveSta.staff;
              (0, _misc.response)(req, res, code, 'STAFF_UPDATED', 'Staff has been updated.', {
                staff: staff
              });

            case 6:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19);
    }));

    return function (_x53, _x54, _x55) {
      return _ref19.apply(this, arguments);
    };
  }()))["delete"]('/:id', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner'), errorHandler( /*#__PURE__*/function () {
    var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(req, res, next) {
      var _yield$deleteStaff, code, staff;

      return regeneratorRuntime.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              _context20.next = 2;
              return deleteStaff(req, res, next);

            case 2:
              _yield$deleteStaff = _context20.sent;
              code = _yield$deleteStaff.code;
              staff = _yield$deleteStaff.staff;
              (0, _misc.response)(req, res, code, 'STAFF_DELETED', 'Staff has been deleted', {
                staff: staff
              });

            case 6:
            case "end":
              return _context20.stop();
          }
        }
      }, _callee20);
    }));

    return function (_x56, _x57, _x58) {
      return _ref20.apply(this, arguments);
    };
  }()));
  return router;
};

var router = staffRouter;
exports.router = router;