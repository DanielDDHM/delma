"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = void 0;

var _express = _interopRequireDefault(require("express"));

var _luxon = require("luxon");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _generatePassword = _interopRequireDefault(require("generate-password"));

var _lodash = _interopRequireDefault(require("lodash"));

var _index = require("./index");

var _misc = require("../../utils/misc");

var _upload = require("../../utils/upload");

var _email = require("../../utils/email");

var _database = require("../../utils/database");

var _errors = _interopRequireDefault(require("../../utils/errors"));

var _config = _interopRequireDefault(require("../../utils/config"));

var _user = _interopRequireDefault(require("../../models/user"));

var _token = _interopRequireDefault(require("../../models/token"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var ObjectId = _database.mongoose.Types.ObjectId;

var getUser = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var user;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user = req.user;
            return _context.abrupt("return", {
              user: user,
              code: 200
            });

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getUser(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var postUsersSearch = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var _req$body, perPage, page, search, sort, filters, num, pageNum, userQuery, regex, searchQuery, availableBooleanFilters, availableTextFilters, fil, _regex, usersAgg, _usersAgg$, total, users;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body = req.body, perPage = _req$body.perPage, page = _req$body.page, search = _req$body.search, sort = _req$body.sort, filters = _req$body.filters;
            num = Number(perPage || 100);
            pageNum = Number(page || 0);
            userQuery = {};

            if (search && search.length) {
              regex = new RegExp(search, 'i');
              searchQuery = [];
              searchQuery.push({
                name: {
                  $regex: regex
                }
              });
              searchQuery.push({
                email: {
                  $regex: regex
                }
              });
              searchQuery.push({
                phone: {
                  $regex: regex
                }
              });
              userQuery.$or = searchQuery;
            }

            availableBooleanFilters = ['isActive'];
            availableTextFilters = ['name', 'email', 'phone'];

            if (filters && Object.keys(filters).length) {
              userQuery.$and = [];

              for (fil in filters) {
                _regex = new RegExp(filters[fil], 'i');

                if (availableBooleanFilters.includes(fil)) {
                  userQuery.$and.push(_defineProperty({}, fil, filters[fil]));
                } else if (availableTextFilters.includes(fil)) {
                  userQuery.$and.push(_defineProperty({}, fil, {
                    $regex: _regex
                  }));
                } else {
                  userQuery.$and.push(_defineProperty({}, fil, {
                    $regex: _regex
                  }));
                }
              }
            }

            _context2.next = 10;
            return _user["default"].aggregate([{
              $match: userQuery
            }, {
              $project: {
                password: 0
              }
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
                users: [{
                  $skip: num * pageNum
                }, {
                  $limit: num
                }]
              }
            }]);

          case 10:
            usersAgg = _context2.sent;
            _usersAgg$ = usersAgg[0], total = _usersAgg$.total, users = _usersAgg$.users;
            return _context2.abrupt("return", {
              users: users,
              total: total.length ? total[0].count : 0,
              code: 200
            });

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function postUsersSearch(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

var postConfirmUser = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
    var id, code, user, token, newToken;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id, code = req.body.code;

            if (!(!code || !id)) {
              _context3.next = 3;
              break;
            }

            throw _errors["default"].not_found;

          case 3:
            _context3.next = 5;
            return _user["default"].findOneAndUpdate({
              _id: id,
              confirmationCode: code
            }, {
              isConfirmed: true,
              code: null
            }, {
              "new": true
            });

          case 5:
            user = _context3.sent;

            if (user) {
              _context3.next = 8;
              break;
            }

            throw _errors["default"].invalid_credentials;

          case 8:
            token = _generatePassword["default"].generateMultiple(2, {
              length: 30,
              numbers: true
            }).toString().replace(',', '.');
            newToken = new _token["default"]({
              user: user._id,
              authToken: token,
              dateExpired: _luxon.DateTime.utc().plus({
                days: _config["default"].tokenDuration
              }).toISO()
            });
            _context3.next = 12;
            return newToken.save();

          case 12:
            user = user.displayInfo();
            return _context3.abrupt("return", {
              user: user,
              token: token,
              code: 200
            });

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function postConfirmUser(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

var postUser = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
    var body, source, lang, user, confirmationCode, photo, newUser;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            body = req.body, source = req.headers.source;
            lang = req.headers['accept-language'];

            if (!(!body.email || !body.password || !body.name)) {
              _context4.next = 4;
              break;
            }

            throw _errors["default"].required_fields_empty;

          case 4:
            _context4.next = 6;
            return _user["default"].findOne({
              email: body.email
            });

          case 6:
            user = _context4.sent;

            if (!user) {
              _context4.next = 9;
              break;
            }

            throw _errors["default"].duplicate_email;

          case 9:
            confirmationCode = Math.floor(Math.random() * 9000) + 1000;

            if (!(body.files && body.files.length)) {
              _context4.next = 23;
              break;
            }

            photo = body.files.find(function (f) {
              return f.fieldName === 'photo';
            });

            if (!(!!photo && user.photo)) {
              _context4.next = 20;
              break;
            }

            _context4.next = 15;
            return (0, _upload.deleteImage)(user.photo, 'users');

          case 15:
            _context4.next = 17;
            return (0, _upload.uploadImage)(photo, 'users');

          case 17:
            body.photo = _context4.sent;
            _context4.next = 23;
            break;

          case 20:
            _context4.next = 22;
            return (0, _upload.uploadImage)(photo, 'users');

          case 22:
            body.photo = _context4.sent;

          case 23:
            body.password = _bcrypt["default"].hashSync(body.password, 10);
            body.confirmationCode = confirmationCode;
            _context4.next = 27;
            return new _user["default"](body).save();

          case 27:
            newUser = _context4.sent;

            if (!(source == 'app')) {
              _context4.next = 34;
              break;
            }

            console.log('CHEGUEI AQUI', _config["default"].keyEmails.confirmAccountCode);
            _context4.next = 32;
            return (0, _email.sendEmail)(_config["default"].keyEmails.confirmAccountCode, null, _objectSpread(_objectSpread({}, _config["default"].emailTags), {}, {
              code: confirmationCode
            }), newUser.email, lang);

          case 32:
            _context4.next = 36;
            break;

          case 34:
            _context4.next = 36;
            return (0, _email.sendEmail)(_config["default"].keyEmails.confirmAccountLink, null, _objectSpread(_objectSpread({}, _config["default"].emailTags), {}, {
              link: "".concat(process.env.WEB_URL, "/confirm/").concat(newUser._id, "/").concat(confirmationCode)
            }), newUser.email, lang);

          case 36:
            user = newUser.displayInfo();
            return _context4.abrupt("return", {
              user: user,
              confirmationCode: confirmationCode,
              code: 201
            });

          case 38:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function postUser(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

var putUpdateUser = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res, next) {
    var body, params, user, photo;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            body = req.body, params = req.params;
            _context5.next = 3;
            return _user["default"].findOne({
              _id: params.id
            });

          case 3:
            user = _context5.sent;

            if (user) {
              _context5.next = 6;
              break;
            }

            throw _errors["default"].not_found;

          case 6:
            if (!(params.id != user._id)) {
              _context5.next = 8;
              break;
            }

            throw _errors["default"].no_permission;

          case 8:
            if (!(body.files && body.files.length)) {
              _context5.next = 21;
              break;
            }

            photo = body.files.find(function (f) {
              return f.fieldName === 'photo';
            });

            if (!(!!photo && user.photo)) {
              _context5.next = 18;
              break;
            }

            _context5.next = 13;
            return (0, _upload.deleteImage)(user.photo, 'users');

          case 13:
            _context5.next = 15;
            return (0, _upload.uploadImage)(photo, 'users');

          case 15:
            body.photo = _context5.sent;
            _context5.next = 21;
            break;

          case 18:
            _context5.next = 20;
            return (0, _upload.uploadImage)(photo, 'users');

          case 20:
            body.photo = _context5.sent;

          case 21:
            _context5.next = 23;
            return _user["default"].findOneAndUpdate({
              _id: params.id
            }, body, {
              fields: '-password',
              "new": true
            });

          case 23:
            user = _context5.sent;
            return _context5.abrupt("return", {
              code: 200,
              user: user
            });

          case 25:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function putUpdateUser(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

var putChangeUserPassword = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res, next) {
    var body, user, currentUser, newPassword;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            body = req.body, user = req.user;
            _context6.next = 3;
            return _user["default"].findOne({
              email: user.email
            });

          case 3:
            currentUser = _context6.sent;

            if (!(!currentUser || !currentUser.comparePassword(body.currentPassword))) {
              _context6.next = 6;
              break;
            }

            throw _errors["default"].invalid_credentials;

          case 6:
            newPassword = _bcrypt["default"].hashSync(body.password, 10);
            _context6.next = 9;
            return _user["default"].findOneAndUpdate({
              email: user.email
            }, {
              password: newPassword
            }, {
              fields: '-password',
              "new": true
            });

          case 9:
            currentUser = _context6.sent;
            return _context6.abrupt("return", {
              user: currentUser,
              code: 200
            });

          case 11:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function putChangeUserPassword(_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}();

var postRecoverPasswordUser = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res, next) {
    var body, params, source, lang, codeParams, user, resetCode, password;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            body = req.body, params = req.params, source = req.headers.source;
            lang = req.headers['accept-language'];
            codeParams = params.code;
            user = {};
            _context7.next = 6;
            return _user["default"].findOne({
              email: body.email
            }).lean();

          case 6:
            user = _context7.sent;

            if (user) {
              _context7.next = 9;
              break;
            }

            return _context7.abrupt("return", {
              code: 200
            });

          case 9:
            if (codeParams) {
              _context7.next = 24;
              break;
            }

            resetCode = Math.floor(Math.random() * 9000) + 1000;
            _context7.next = 13;
            return _user["default"].updateOne({
              email: body.email
            }, {
              resetCode: resetCode
            });

          case 13:
            if (!(source === 'app')) {
              _context7.next = 19;
              break;
            }

            _context7.next = 16;
            return (0, _email.sendEmail)(_config["default"].keyEmails.recoverPasswordCode, null, _objectSpread(_objectSpread({}, _config["default"].emailTags), {}, {
              code: resetCode
            }), user.email, lang);

          case 16:
            return _context7.abrupt("return", {
              code: 200,
              resetCode: resetCode
            });

          case 19:
            _context7.next = 21;
            return (0, _email.sendEmail)(_config["default"].keyEmails.recoverPasswordLink, null, _objectSpread(_objectSpread({}, _config["default"].emailTags), {}, {
              link: "".concat(process.env.WEB_URL, "/recover-password/").concat(user._id, "/").concat(resetCode)
            }), user.email, lang);

          case 21:
            return _context7.abrupt("return", {
              code: 200
            });

          case 22:
            _context7.next = 31;
            break;

          case 24:
            password = _bcrypt["default"].hashSync(body.password, 10);
            _context7.next = 27;
            return _user["default"].findOneAndUpdate({
              _id: user._id,
              resetCode: codeParams
            }, {
              password: password,
              resetCode: null,
              isConfirmed: true
            }).lean();

          case 27:
            user = _context7.sent;

            if (user) {
              _context7.next = 30;
              break;
            }

            throw _errors["default"].invalid_credentials;

          case 30:
            return _context7.abrupt("return", {
              code: 200
            });

          case 31:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function postRecoverPasswordUser(_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}();

var patchResendCode = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res, next) {
    var id, source, lang, user, confirmationCode;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            id = req.params.id, source = req.headers.source;
            lang = req.headers['accept-language'];
            _context8.next = 4;
            return _user["default"].findOne({
              _id: id
            }).lean();

          case 4:
            user = _context8.sent;

            if (user) {
              _context8.next = 7;
              break;
            }

            return _context8.abrupt("return", {
              code: 200
            });

          case 7:
            confirmationCode = user.confirmationCode;

            if (confirmationCode) {
              _context8.next = 12;
              break;
            }

            confirmationCode = Math.floor(Math.random() * 9000) + 1000;
            _context8.next = 12;
            return _user["default"].updateOne({
              _id: user._id
            }, {
              confirmationCode: confirmationCode
            });

          case 12:
            if (!(source === 'app')) {
              _context8.next = 17;
              break;
            }

            _context8.next = 15;
            return (0, _email.sendEmail)(_config["default"].keyEmails.confirmAccountCode, null, _objectSpread(_objectSpread({}, _config["default"].emailTags), {}, {
              code: confirmationCode
            }), user.email, lang);

          case 15:
            _context8.next = 19;
            break;

          case 17:
            _context8.next = 19;
            return (0, _email.sendEmail)(_config["default"].keyEmails.confirmAccountLink, null, _objectSpread(_objectSpread({}, _config["default"].emailTags), {}, {
              link: "".concat(process.env.WEB_URL, "/confirm/").concat(newUser._id, "/").concat(confirmationCode)
            }), user.email, lang);

          case 19:
            return _context8.abrupt("return", {
              code: 200,
              confirmationCode: confirmationCode
            });

          case 20:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function patchResendCode(_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}();

var getHome = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req) {
    var user;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            user = req.user;
            return _context9.abrupt("return", {
              code: 200
            });

          case 2:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function getHome(_x25) {
    return _ref9.apply(this, arguments);
  };
}();

var patchForgotUser = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req) {
    var _forgotUser;

    var id, existUser, forgotUser, _yield$Promise$all, _yield$Promise$all2, user;

    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            id = req.params.id;
            _context10.next = 3;
            return _user["default"].findOne({
              _id: id
            });

          case 3:
            existUser = _context10.sent;
            if (!existUser) _errors["default"].not_found;
            console.log('USER', user);
            forgotUser = (_forgotUser = {
              email: "".concat(id, "@delmanicolace.com"),
              name: 'John Doe',
              password: null,
              photo: null,
              isGoogle: false,
              googleToken: null,
              isFacebook: false,
              facebookToken: null,
              isApple: false,
              appleToken: null
            }, _defineProperty(_forgotUser, "password", null), _defineProperty(_forgotUser, "phone", null), _defineProperty(_forgotUser, "confirmationCode", null), _defineProperty(_forgotUser, "resetCode", null), _defineProperty(_forgotUser, "isActive", false), _defineProperty(_forgotUser, "isDelete", true), _forgotUser);
            _context10.next = 9;
            return Promise.all([_user["default"].findOneAndUpdate({
              _id: id
            }, forgotUser, {
              "new": true
            }), _token["default"].deleteMany({
              user: id
            })]);

          case 9:
            _yield$Promise$all = _context10.sent;
            _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 1);
            user = _yield$Promise$all2[0];
            console.log('USER', user);
            return _context10.abrupt("return", {
              code: 200,
              user: user
            });

          case 14:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function patchForgotUser(_x26) {
    return _ref10.apply(this, arguments);
  };
}();

var usersRouter = function usersRouter(errorHandler) {
  var router = _express["default"].Router();

  router.get('/home', (0, _index.checkToken)(false, true), (0, _index.checkRole)('user'), errorHandler( /*#__PURE__*/function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(req, res, next) {
      var _yield$getHome, code;

      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return getHome(req, res, next);

            case 2:
              _yield$getHome = _context11.sent;
              code = _yield$getHome.code;
              (0, _misc.response)(req, res, code, 'USER_HOME_FOUND', 'Found User Home', {});

            case 5:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));

    return function (_x27, _x28, _x29) {
      return _ref11.apply(this, arguments);
    };
  }())).get('/:id?', (0, _index.checkToken)(), errorHandler( /*#__PURE__*/function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(req, res, next) {
      var _yield$getUser, code, user;

      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return getUser(req, res, next);

            case 2:
              _yield$getUser = _context12.sent;
              code = _yield$getUser.code;
              user = _yield$getUser.user;
              (0, _misc.response)(req, res, code, 'USERS_FOUND', 'Found Users', {
                user: user
              });

            case 6:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }));

    return function (_x30, _x31, _x32) {
      return _ref12.apply(this, arguments);
    };
  }())).post('/search', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(req, res, next) {
      var _yield$postUsersSearc, code, users, total;

      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return postUsersSearch(req, res, next);

            case 2:
              _yield$postUsersSearc = _context13.sent;
              code = _yield$postUsersSearc.code;
              users = _yield$postUsersSearc.users;
              total = _yield$postUsersSearc.total;
              (0, _misc.response)(req, res, code, 'USERS_FOUND', 'Found Users', {
                users: users,
                total: total
              });

            case 7:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    }));

    return function (_x33, _x34, _x35) {
      return _ref13.apply(this, arguments);
    };
  }())).post('/', errorHandler( /*#__PURE__*/function () {
    var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(req, res, next) {
      var _yield$postUser, code, user, confirmationCode;

      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return postUser(req, res, next);

            case 2:
              _yield$postUser = _context14.sent;
              code = _yield$postUser.code;
              user = _yield$postUser.user;
              confirmationCode = _yield$postUser.confirmationCode;
              (0, _misc.response)(req, res, code, 'USER_CREATED', 'User has been created', {
                user: user,
                confirmationCode: confirmationCode
              });

            case 7:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    }));

    return function (_x36, _x37, _x38) {
      return _ref14.apply(this, arguments);
    };
  }())).post('/recover-password/:code?', errorHandler( /*#__PURE__*/function () {
    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(req, res, next) {
      var _yield$postRecoverPas, code, resetCode;

      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return postRecoverPasswordUser(req, res, next);

            case 2:
              _yield$postRecoverPas = _context15.sent;
              code = _yield$postRecoverPas.code;
              resetCode = _yield$postRecoverPas.resetCode;

              if (req.headers.source === 'app') {
                (0, _misc.response)(req, res, code, 'PASSWORD_RESET', 'User password reset', {
                  resetCode: resetCode
                });
              } else {
                (0, _misc.response)(req, res, code, 'PASSWORD_RESET', 'User password reset');
              }

            case 6:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    }));

    return function (_x39, _x40, _x41) {
      return _ref15.apply(this, arguments);
    };
  }())).post('/confirm/:id', errorHandler( /*#__PURE__*/function () {
    var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(req, res, next) {
      var _yield$postConfirmUse, code, user, token;

      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return postConfirmUser(req, res, next);

            case 2:
              _yield$postConfirmUse = _context16.sent;
              code = _yield$postConfirmUse.code;
              user = _yield$postConfirmUse.user;
              token = _yield$postConfirmUse.token;
              (0, _misc.response)(req, res, code, 'USER_CONFIRMED', 'User has been confirmed', {
                user: user,
                token: token
              });

            case 7:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    }));

    return function (_x42, _x43, _x44) {
      return _ref16.apply(this, arguments);
    };
  }())).put('/change-password', (0, _index.checkToken)(), (0, _index.checkRole)('user'), errorHandler( /*#__PURE__*/function () {
    var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(req, res, next) {
      var _yield$putChangeUserP, code, user;

      return regeneratorRuntime.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return putChangeUserPassword(req, res, next);

            case 2:
              _yield$putChangeUserP = _context17.sent;
              code = _yield$putChangeUserP.code;
              user = _yield$putChangeUserP.user;
              (0, _misc.response)(req, res, code, 'USER_PASSWORD_CHANGED', 'User has been updated', {
                user: user
              });

            case 6:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17);
    }));

    return function (_x45, _x46, _x47) {
      return _ref17.apply(this, arguments);
    };
  }())).put('/:id', (0, _index.checkToken)(), (0, _index.checkRole)('user'), (0, _index.formDataParser)(), errorHandler( /*#__PURE__*/function () {
    var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(req, res, next) {
      var _yield$putUpdateUser, code, user;

      return regeneratorRuntime.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return putUpdateUser(req, res, next);

            case 2:
              _yield$putUpdateUser = _context18.sent;
              code = _yield$putUpdateUser.code;
              user = _yield$putUpdateUser.user;
              (0, _misc.response)(req, res, code, 'USER_UPDATED', 'User has been updated', {
                user: user
              });

            case 6:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18);
    }));

    return function (_x48, _x49, _x50) {
      return _ref18.apply(this, arguments);
    };
  }())).patch('/:id/resend-code', errorHandler( /*#__PURE__*/function () {
    var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(req, res, next) {
      var _yield$patchResendCod, code, confirmationCode;

      return regeneratorRuntime.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              _context19.next = 2;
              return patchResendCode(req, res, next);

            case 2:
              _yield$patchResendCod = _context19.sent;
              code = _yield$patchResendCod.code;
              confirmationCode = _yield$patchResendCod.confirmationCode;
              (0, _misc.response)(req, res, code, 'CODE_RESEND', 'The code has been resented', {
                confirmationCode: confirmationCode
              });

            case 6:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19);
    }));

    return function (_x51, _x52, _x53) {
      return _ref19.apply(this, arguments);
    };
  }())).patch('/:id/forget', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner'), errorHandler( /*#__PURE__*/function () {
    var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(req, res, next) {
      var _yield$patchForgotUse, code, user;

      return regeneratorRuntime.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              _context20.next = 2;
              return patchForgotUser(req, res, next);

            case 2:
              _yield$patchForgotUse = _context20.sent;
              code = _yield$patchForgotUse.code;
              user = _yield$patchForgotUse.user;
              (0, _misc.response)(req, res, code, 'USER_FORGOTTEN', 'User has been forgotten', {
                user: user
              });

            case 6:
            case "end":
              return _context20.stop();
          }
        }
      }, _callee20);
    }));

    return function (_x54, _x55, _x56) {
      return _ref20.apply(this, arguments);
    };
  }()));
  return router;
};

var router = usersRouter;
exports.router = router;