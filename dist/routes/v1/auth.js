"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = void 0;

var _express = _interopRequireDefault(require("express"));

var _luxon = require("luxon");

var _generatePassword = _interopRequireDefault(require("generate-password"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _lodash = _interopRequireDefault(require("lodash"));

var _index = require("./index");

var _database = require("../../utils/database");

var _misc = require("../../utils/misc");

var _email = require("../../utils/email");

var _errors = _interopRequireDefault(require("../../utils/errors"));

var _config = _interopRequireDefault(require("../../utils/config"));

var _token = _interopRequireDefault(require("../../models/token"));

var _staff = _interopRequireDefault(require("../../models/staff"));

var _user = _interopRequireDefault(require("../../models/user"));

var _invite2 = _interopRequireDefault(require("../../models/invite"));

var _notificationToken = _interopRequireDefault(require("../../models/notificationToken"));

var _excluded = ["code", "status", "message"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var auth = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var body, source, lang, isBO, isAPP, isWEB, user, decoded, confirmationCode, _yield$Promise$all, _yield$Promise$all2, invite, owner, _invite, newGoogleUser, newFacebookUser, newAppleUser, token, newToken;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            body = req.body;
            source = req.headers.source;
            lang = req.headers['accept-language'];
            isBO = source === 'bo', isAPP = source === 'app', isWEB = source === 'web';
            console.log('BODY', body);

            if (isBO) {
              _context.next = 12;
              break;
            }

            if (!body.email && body.identityTokenApple) {
              console.log('ENTREI AQUI');
              decoded = _jsonwebtoken["default"].decode(body.identityTokenApple);
              console.log('DECODED', decoded);
              body.email = decoded.email;
              body.name = body.name === 'null null' ? body.name = '' : body.name;
              console.log('SAI AQUI', body.email);
            }

            _context.next = 9;
            return _user["default"].findOne({
              email: body.email
            });

          case 9:
            user = _context.sent;
            _context.next = 17;
            break;

          case 12:
            _context.next = 14;
            return _staff["default"].findOne({
              email: body.email
            });

          case 14:
            user = _context.sent;

            if (user) {
              _context.next = 17;
              break;
            }

            throw _errors["default"].invalid_credentials;

          case 17:
            if (!(user && body.password && !user.comparePassword(body.password))) {
              _context.next = 19;
              break;
            }

            throw _errors["default"].invalid_credentials;

          case 19:
            if (!(user && body.password && !user.isConfirmed)) {
              _context.next = 53;
              break;
            }

            confirmationCode = Math.floor(Math.random() * 9000) + 1000;

            if (isBO) {
              _context.next = 36;
              break;
            }

            _context.next = 24;
            return _user["default"].updateOne({
              _id: user._id
            }, {
              $set: {
                confirmationCode: confirmationCode
              }
            });

          case 24:
            if (!isAPP) {
              _context.next = 30;
              break;
            }

            _context.next = 27;
            return (0, _email.sendEmail)(_config["default"].keyEmails.confirmAccountCode, null, _objectSpread(_objectSpread({}, _config["default"].emailTags), {}, {
              code: confirmationCode
            }), user.email, lang);

          case 27:
            return _context.abrupt("return", {
              status: 400,
              code: 'USER_NOT_CONFIRMED',
              message: 'User not confirmed',
              user: user,
              confirmationCode: confirmationCode
            });

          case 30:
            if (!isWEB) {
              _context.next = 34;
              break;
            }

            _context.next = 33;
            return (0, _email.sendEmail)(_config["default"].keyEmails.confirmAccountLink, null, _objectSpread(_objectSpread({}, _config["default"].emailTags), {}, {
              link: "".concat(process.env.WEB_URL, "/confirm/").concat(user._id, "/").concat(confirmationCode)
            }), user.email, lang);

          case 33:
            return _context.abrupt("return", {
              status: 400,
              code: 'USER_NOT_CONFIRMED',
              message: 'User not confirmed, please check your email and confirm your account'
            });

          case 34:
            _context.next = 53;
            break;

          case 36:
            _context.next = 38;
            return Promise.all([_invite2["default"].findOne({
              staff: user._id
            }).populate('staff from'), _staff["default"].findOne({
              role: 'owner'
            })]);

          case 38:
            _yield$Promise$all = _context.sent;
            _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
            invite = _yield$Promise$all2[0];
            owner = _yield$Promise$all2[1];

            if (!invite) {
              _context.next = 47;
              break;
            }

            _context.next = 45;
            return (0, _email.sendEmail)(_config["default"].keyEmails.confirmStaffLink, null, _objectSpread(_objectSpread({}, _config["default"].emailTags), {}, {
              staff_name: invite.from.name,
              staff_email: invite.from.email,
              link: "".concat(process.env.BO_URL, "/accept-invite/").concat(invite._id, "/").concat(invite.invitationCode)
            }), invite.staff.email);

          case 45:
            _context.next = 52;
            break;

          case 47:
            _context.next = 49;
            return (0, _invite2["default"])({
              staff: user._id,
              from: owner._id,
              invitationCode: confirmationCode
            }).save();

          case 49:
            _invite = _context.sent;
            _context.next = 52;
            return (0, _email.sendEmail)(_config["default"].keyEmails.confirmStaffLink, null, _objectSpread(_objectSpread({}, _config["default"].emailTags), {}, {
              staff_name: owner.name,
              staff_email: owner.email,
              link: "".concat(process.env.BO_URL, "/accept-invite/").concat(_invite._id, "/").concat(_invite.invitationCode)
            }), _invite.staff.email);

          case 52:
            return _context.abrupt("return", {
              status: 400,
              code: 'USER_NOT_CONFIRMED',
              message: 'Utilizador não confirmado, enviámos um email, de modo a que possa concluir o processo de confirmação'
            });

          case 53:
            if (user) {
              _context.next = 81;
              break;
            }

            if (!(!isBO && body.googleToken)) {
              _context.next = 62;
              break;
            }

            newGoogleUser = new _user["default"](body);
            newGoogleUser.isGoogle = true;
            _context.next = 59;
            return newGoogleUser.save();

          case 59:
            user = _context.sent;
            _context.next = 79;
            break;

          case 62:
            if (!(!isBO && body.facebookToken)) {
              _context.next = 70;
              break;
            }

            newFacebookUser = new _user["default"](body);
            newFacebookUser.isFacebook = true;
            _context.next = 67;
            return newFacebookUser.save();

          case 67:
            user = _context.sent;
            _context.next = 79;
            break;

          case 70:
            if (!(!isBO && (body.appletoken || body.identityTokenApple))) {
              _context.next = 78;
              break;
            }

            newAppleUser = new _user["default"](body);
            newAppleUser.isApple = true;
            _context.next = 75;
            return newAppleUser.save();

          case 75:
            user = _context.sent;
            _context.next = 79;
            break;

          case 78:
            throw _errors["default"].invalid_credentials;

          case 79:
            _context.next = 94;
            break;

          case 81:
            if (!(!isBO && body.googleToken)) {
              _context.next = 86;
              break;
            }

            _context.next = 84;
            return _user["default"].updateOne({
              _id: user._id
            }, {
              $set: {
                googleToken: body.googleToken,
                isGoogle: true
              }
            });

          case 84:
            _context.next = 94;
            break;

          case 86:
            if (!(!isBO && body.facebookToken)) {
              _context.next = 91;
              break;
            }

            _context.next = 89;
            return _user["default"].updateOne({
              _id: user._id
            }, {
              $set: {
                facebookToken: body.facebookToken,
                isFacebook: true
              }
            });

          case 89:
            _context.next = 94;
            break;

          case 91:
            if (!(!isBO && body.appleToken)) {
              _context.next = 94;
              break;
            }

            _context.next = 94;
            return _user["default"].updateOne({
              _id: user._id
            }, {
              $set: {
                appleToken: body.appleToken,
                isApple: true
              }
            });

          case 94:
            token = _generatePassword["default"].generateMultiple(2, {
              length: 30,
              numbers: true
            }).toString().replace(',', '.');
            newToken = new _token["default"]({
              user: !isBO ? user._id : null,
              staff: isBO ? user._id : null,
              authToken: token,
              dateExpired: _luxon.DateTime.utc().plus({
                days: _config["default"].tokenDuration
              }).toISO()
            });
            _context.next = 98;
            return newToken.save();

          case 98:
            user = user.displayInfo();
            return _context.abrupt("return", {
              status: 200,
              code: 'LOGIN_SUCCESS',
              message: 'Login Success',
              user: user,
              token: token
            });

          case 100:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function auth(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var signOut = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var token;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            token = req.headers['authorization'];

            if (!token) {
              _context2.next = 5;
              break;
            }

            token = token.split(' ');
            _context2.next = 5;
            return _token["default"].deleteOne({
              authToken: token[1]
            });

          case 5:
            return _context2.abrupt("return", {
              code: 200
            });

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function signOut(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

var postNotificationToken = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
    var _req$body, notificationToken, device, language, user, updatedToken;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _req$body = req.body, notificationToken = _req$body.notificationToken, device = _req$body.device, language = _req$body.language, user = req.user;

            if (notificationToken) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt("return", {
              code: 200
            });

          case 3:
            updatedToken = {
              user: user.role === 'user' ? user._id : null,
              token: notificationToken,
              device: device,
              language: language ? language : 'pt'
            };
            _context3.next = 6;
            return _notificationToken["default"].findOneAndUpdate({
              token: notificationToken
            }, updatedToken, {
              upsert: true
            });

          case 6:
            return _context3.abrupt("return", {
              code: 200
            });

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function postNotificationToken(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

var authRouter = function authRouter(errorHandler) {
  var router = _express["default"].Router();

  router.post('/login', errorHandler( /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
      var _yield$auth, code, status, message, responseObj;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return auth(req, res, next);

            case 2:
              _yield$auth = _context4.sent;
              code = _yield$auth.code;
              status = _yield$auth.status;
              message = _yield$auth.message;
              responseObj = _objectWithoutProperties(_yield$auth, _excluded);
              (0, _misc.response)(req, res, status, code, message, responseObj);

            case 8:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x10, _x11, _x12) {
      return _ref4.apply(this, arguments);
    };
  }())).post('/logout', errorHandler( /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res, next) {
      var _yield$signOut, code;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return signOut(req, res, next);

            case 2:
              _yield$signOut = _context5.sent;
              code = _yield$signOut.code;
              (0, _misc.response)(req, res, code, 'LOGGED_OUT', 'Logged Out');

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x13, _x14, _x15) {
      return _ref5.apply(this, arguments);
    };
  }())).post('/notif-token', (0, _index.checkToken)(), (0, _index.checkRole)('user'), errorHandler( /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res, next) {
      var _yield$postNotificati, code;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return postNotificationToken(req, res, next);

            case 2:
              _yield$postNotificati = _context6.sent;
              code = _yield$postNotificati.code;
              (0, _misc.response)(req, res, code, 'NOTIFICATION_TOKEN_ADDED', 'Notification Token Added');

            case 5:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x16, _x17, _x18) {
      return _ref6.apply(this, arguments);
    };
  }()));
  return router;
};

var router = authRouter;
exports.router = router;