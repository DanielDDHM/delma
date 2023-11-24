"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkToken = exports.checkRole = void 0;
exports["default"] = _default;
exports.formDataParser = void 0;

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _luxon = require("luxon");

var _database = require("../../utils/database");

var _misc = require("../../utils/misc");

var _errors = _interopRequireDefault(require("../../utils/errors"));

var _config = _interopRequireDefault(require("../../utils/config"));

var _busboy = _interopRequireDefault(require("busboy"));

var _token = _interopRequireDefault(require("../../models/token"));

var _staff = _interopRequireDefault(require("../../models/staff"));

var _user = _interopRequireDefault(require("../../models/user"));

var _auth = require("./auth");

var _countries = require("./countries");

var _albuns = require("./albuns");

var _books = require("./books");

var _emailTemplates = require("./email-templates");

var _pages = require("./pages");

var _scheduleNotifs = require("./schedule-notifs");

var _staff2 = require("./staff");

var _statistics = require("./statistics");

var _users = require("./users");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var errorHandler = function errorHandler(fn) {
  return function (req, res, next) {
    return fn(req, res, next)["catch"](function (err) {
      next((0, _misc.error)(err));
    });
  };
};

var formDataParser = function formDataParser() {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
      var availableExtensions, contentType, busboy, result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              availableExtensions = ['png', 'jpeg', 'jpg', 'mov', 'mp3', 'mp4', 'mpeg', 'ogg', 'xlsx', 'octet-stream', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
              contentType = req.headers['content-type'];

              if (contentType && contentType.includes('form-data')) {
                req.headers['content-type'] = contentType;
                busboy = new _busboy["default"]({
                  headers: {
                    'content-type': contentType
                  }
                });
                result = {
                  files: []
                };
                busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
                  var fileExt = mimetype.split('/')[1].toLowerCase();
                  console.log("filext", fileExt);
                  if (!availableExtensions.includes(fileExt)) throw _errors["default"].invalid_file_extension;
                  var fileData = [];
                  file.on('data', function (data) {
                    fileData.push(data);
                  });
                  file.on('end', function () {
                    result.files.push({
                      file: Buffer.concat(fileData),
                      fileName: filename,
                      fieldName: fieldname,
                      contentType: mimetype
                    });
                  });
                });
                busboy.on('field', function (fieldname, value) {
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

              _context.next = 9;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", next((0, _misc.error)(_context.t0)));

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 6]]);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
};

exports.formDataParser = formDataParser;

var checkToken = function checkToken() {
  var tokenless = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
      var token, apiKey, newToken, staff;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              token = req.headers['authorization'];
              apiKey = req.headers['api-key'];

              if (!token) {
                _context2.next = 36;
                break;
              }

              token = token.split(' ');

              if (!(token[0] !== 'Bearer')) {
                _context2.next = 7;
                break;
              }

              throw _errors["default"].invalid_header;

            case 7:
              if (!(token[1] == void 0 || token[1] == 'null')) {
                _context2.next = 9;
                break;
              }

              throw _errors["default"].invalid_token;

            case 9:
              _context2.next = 11;
              return _token["default"].findOne({
                authToken: token[1]
              });

            case 11:
              newToken = _context2.sent;

              if (newToken) {
                _context2.next = 14;
                break;
              }

              throw _errors["default"].invalid_token;

            case 14:
              if (!(_luxon.DateTime.utc() >= _luxon.DateTime.fromISO(newToken.dateExpired).toUTC())) {
                _context2.next = 18;
                break;
              }

              _context2.next = 17;
              return _token["default"].findOneAndDelete({
                authToken: token[1]
              });

            case 17:
              throw _errors["default"].token_expired;

            case 18:
              _context2.next = 20;
              return _token["default"].updateOne({
                _id: newToken._id
              }, {
                '$set': {
                  dateExpired: _luxon.DateTime.utc().plus({
                    days: _config["default"].tokenDuration
                  }).toISO()
                }
              });

            case 20:
              if (!newToken.staff) {
                _context2.next = 29;
                break;
              }

              _context2.next = 23;
              return _staff["default"].findOne({
                _id: newToken.staff
              }).lean();

            case 23:
              staff = _context2.sent;
              req.user = staff;

              if (req.user) {
                _context2.next = 27;
                break;
              }

              throw _errors["default"].invalid_token;

            case 27:
              _context2.next = 33;
              break;

            case 29:
              req.user = _user["default"].findOne({
                _id: newToken.user
              });

              if (req.user) {
                _context2.next = 32;
                break;
              }

              throw _errors["default"].invalid_token;

            case 32:
              req.user.role = 'user';

            case 33:
              next();
              _context2.next = 45;
              break;

            case 36:
              if (!((apiKey || tokenless) && !token)) {
                _context2.next = 44;
                break;
              }

              if (!(apiKey == _config["default"].apiKey || tokenless)) {
                _context2.next = 41;
                break;
              }

              return _context2.abrupt("return", next());

            case 41:
              throw _errors["default"].invalid_api_key;

            case 42:
              _context2.next = 45;
              break;

            case 44:
              throw _errors["default"].invalid_token;

            case 45:
              _context2.next = 50;
              break;

            case 47:
              _context2.prev = 47;
              _context2.t0 = _context2["catch"](0);
              return _context2.abrupt("return", next((0, _misc.error)(_context2.t0)));

            case 50:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 47]]);
    }));

    return function (_x4, _x5, _x6) {
      return _ref2.apply(this, arguments);
    };
  }();
};

exports.checkToken = checkToken;

var checkRole = function checkRole() {
  var requestedRoles = _lodash["default"].flatten(arguments);

  return function (req, res, next) {
    if (!req.user) return next((0, _misc.error)(_errors["default"].invalid_credentials));
    console.log('REQUEST ROLE: ', requestedRoles);
    console.log('ROLE: ', req.user.role);
    if (requestedRoles.indexOf(req.user.role) == -1) return next((0, _misc.error)(_errors["default"].no_permission));
    next();
  };
};

exports.checkRole = checkRole;

function _default(app, server, mode) {
  var router = _express["default"].Router();

  router.use('/albuns', (0, _albuns.router)(errorHandler));
  router.use('/auth', (0, _auth.router)(errorHandler));
  router.use('/books', (0, _books.router)(errorHandler));
  router.use('/countries', (0, _countries.router)(errorHandler));
  router.use('/email-templates', (0, _emailTemplates.router)(errorHandler)); // router.use('/musics', musicsRouter(errorHandler));
  // router.use('/orders', ordersRouter(errorHandler));

  router.use('/pages', (0, _pages.router)(errorHandler)); // router.use('/payments', paymentsRouter(errorHandler));
  // router.use('/playlists', playlistsRouter(errorHandler));

  router.use('/notifications', (0, _scheduleNotifs.router)(errorHandler));
  router.use('/staff', (0, _staff2.router)(errorHandler));
  router.use('/statistics', (0, _statistics.router)(errorHandler));
  router.use('/users', (0, _users.router)(errorHandler));
  return router;
}