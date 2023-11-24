"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateNIF = exports.validateLanguageModel = exports.translateString = exports.roundTo = exports.response = exports.error = void 0;

var _luxon = require("luxon");

var _axios = _interopRequireDefault(require("axios"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _lodash = _interopRequireDefault(require("lodash"));

var _webApi = require("@slack/web-api");

var _meta = _interopRequireDefault(require("../models/meta"));

var _log = _interopRequireDefault(require("../models/log"));

var _statistic = _interopRequireDefault(require("../models/statistic"));

var _user = _interopRequireDefault(require("../models/user"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var BLACK_LIST = [207];

var response = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var status,
        code,
        message,
        data,
        log,
        user,
        source,
        responseTime,
        newMeta,
        dateNow,
        existLastUsage,
        lastUsage,
        newEntry,
        difTime,
        _lastUsage,
        _newEntry,
        _lastUsage2,
        _newEntry2,
        slackToken,
        conversationId,
        slack,
        lang,
        msg,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            status = _args.length > 2 && _args[2] !== undefined ? _args[2] : 500;
            code = _args.length > 3 && _args[3] !== undefined ? _args[3] : null;
            message = _args.length > 4 && _args[4] !== undefined ? _args[4] : null;
            data = _args.length > 5 && _args[5] !== undefined ? _args[5] : null;
            log = _args.length > 6 && _args[6] !== undefined ? _args[6] : process.env.LOGS_RECORD === 'true' ? true : false;
            user = req.user, source = req.headers.source;

            if (!(!BLACK_LIST.includes(status) && log && req._startTime)) {
              _context.next = 15;
              break;
            }

            responseTime = _luxon.DateTime.local().diff(_luxon.DateTime.fromJSDate(req._startTime), 'milliseconds').valueOf();

            if ('password' in req.body) {
              req.body.password = _bcrypt["default"].hashSync(req.body.password, 10);
            }

            if ('currentPassword' in req.body) {
              req.body.currentPassword = _bcrypt["default"].hashSync(req.body.currentPassword, 10);
            }

            _context.next = 12;
            return new _meta["default"]({
              response: message,
              date: new Date(req._startTime),
              res: {
                results: data,
                statusCode: status
              },
              req: {
                url: req.url,
                headers: req.headers,
                method: req.method,
                httpVersion: req.httpVersion,
                originalUrl: req.originalUrl,
                query: req.query,
                body: req.body
              },
              responseTime: responseTime
            }).save();

          case 12:
            newMeta = _context.sent;
            _context.next = 15;
            return new _log["default"]({
              level: log ? 'info' : 'error',
              message: "[".concat(_luxon.DateTime.utc().toFormat('f'), "] ").concat(status, " ").concat(req.method, " ").concat(responseTime, "ms ").concat(req.url),
              response: message,
              description: req.originalUrl,
              userId: req.user && req.user._id,
              date: _luxon.DateTime.fromISO(req._startTime).toUTC().toISO(),
              token: req.headers && req.headers.authorization && req.headers.authorization.split(' ')[1],
              method: req.method,
              code: status,
              source: req.headers && req.headers.source,
              meta: newMeta._id
            }).save();

          case 15:
            if (!(source != 'bo' && user && user.role === 'user')) {
              _context.next = 53;
              break;
            }

            dateNow = _luxon.DateTime.utc().startOf('day');

            if (!(user.lastUsage && user.lastUsage.length)) {
              _context.next = 44;
              break;
            }

            existLastUsage = user.lastUsage.find(function (element) {
              return element.os === req.headers.os && element.type === source;
            });

            if (existLastUsage) {
              _context.next = 31;
              break;
            }

            lastUsage = {
              type: source,
              os: req.headers.os,
              date: dateNow
            };
            newEntry = {
              date: dateNow,
              user: user._id,
              type: source,
              os: req.headers.os,
              deviceId: req.headers.deviceId,
              platform: req.headers.model
            };
            _context.prev = 22;
            _context.next = 25;
            return Promise.all([new _statistic["default"](newEntry).save(), _user["default"].updateOne({
              _id: user._id
            }, {
              $push: {
                lastUsage: lastUsage
              }
            })]);

          case 25:
            _context.next = 29;
            break;

          case 27:
            _context.prev = 27;
            _context.t0 = _context["catch"](22);

          case 29:
            _context.next = 42;
            break;

          case 31:
            difTime = Math.round(dateNow.diff(_luxon.DateTime.fromJSDate(existLastUsage.date), 'days').days);

            if (!(difTime > 0)) {
              _context.next = 42;
              break;
            }

            _lastUsage = {
              type: source,
              os: req.headers.os,
              date: dateNow
            };
            _newEntry = {
              date: dateNow,
              user: user._id,
              type: source,
              os: req.headers.os,
              deviceId: req.headers.deviceId,
              platform: req.headers.model
            };
            _context.prev = 35;
            _context.next = 38;
            return Promise.all([new _statistic["default"](_newEntry).save(), _user["default"].updateOne({
              _id: user._id,
              'lastUsage._id': existLastUsage._id
            }, {
              $set: {
                'lastUsage.$': _lastUsage
              }
            })]);

          case 38:
            _context.next = 42;
            break;

          case 40:
            _context.prev = 40;
            _context.t1 = _context["catch"](35);

          case 42:
            _context.next = 53;
            break;

          case 44:
            _lastUsage2 = [{
              type: source,
              os: req.headers.os,
              date: dateNow
            }];
            _newEntry2 = {
              date: dateNow,
              user: user._id,
              type: source,
              os: req.headers.os,
              deviceId: req.headers.deviceId,
              platform: req.headers.model
            };
            _context.prev = 46;
            _context.next = 49;
            return Promise.all([new _statistic["default"](_newEntry2).save(), _user["default"].updateOne({
              _id: user._id
            }, {
              $set: {
                lastUsage: _lastUsage2
              }
            })]);

          case 49:
            _context.next = 53;
            break;

          case 51:
            _context.prev = 51;
            _context.t2 = _context["catch"](46);

          case 53:
            if (!(status == 500 || status == 402)) {
              _context.next = 65;
              break;
            }

            _context.prev = 54;
            slackToken = process.env.SLACK_TOKEN;
            conversationId = process.env.SLACK_CHANNEL;
            slack = new _webApi.WebClient(slackToken);
            _context.next = 60;
            return slack.chat.postMessage({
              text: "An API error happens in the enviroment: (".concat(req.method, " - ").concat(process.env.NODE_ENV, ")\nEndpoint: ").concat(req.url, "\nMessage: ").concat(message),
              channel: conversationId
            });

          case 60:
            _context.next = 65;
            break;

          case 62:
            _context.prev = 62;
            _context.t3 = _context["catch"](54);
            console.log("ERROR", _context.t3);

          case 65:
            lang = res.req.headers['accept-language'];
            msg = JSON.parse(JSON.stringify(message));
            if (msg[lang]) msg = msg[lang];
            res.status(status).json({
              code: code,
              message: msg,
              results: data
            });

          case 69:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[22, 27], [35, 40], [46, 51], [54, 62]]);
  }));

  return function response(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.response = response;

var error = function error(err) {
  var error = new Error(JSON.stringify(err.message));
  error.status = err.status;
  error.code = err.code;
  return error;
};

exports.error = error;

var validateLanguageModel = function validateLanguageModel(obj) {
  if (obj && _typeof(obj) === 'object' && Object.keys(obj).length > 0) {
    for (var key in obj) {
      if (typeof obj[key] === 'string' && obj[key].length > 0) {
        return true;
      }
    }

    return false;
  }

  return false;
};

exports.validateLanguageModel = validateLanguageModel;

var validateNIF = function validateNIF(nif) {
  nif = nif.substring(2, nif.length);

  if (nif.length == 9) {
    var added = nif[7] * 2 + nif[6] * 3 + nif[5] * 4 + nif[4] * 5 + nif[3] * 6 + nif[2] * 7 + nif[1] * 8 + nif[0] * 9;
    var mod = added % 11;
    var control;

    if (mod == 0 || mod == 1) {
      control = 0;
    } else {
      control = 11 - mod;
    }

    if (nif[8] == control) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

exports.validateNIF = validateNIF;

var roundTo = function roundTo(n, digits) {
  if (digits === undefined) {
    digits = 0;
  }

  var multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  var test = Math.round(n) / multiplicator;
  return +test.toFixed(digits);
};

exports.roundTo = roundTo;

var translateString = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(objToTranslate) {
    var deeplKey, textToTranslate, textTranslated, originLang, objTranslated, parameters;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            deeplKey = process.env.DEEPL_KEY;

            if (deeplKey) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return", objToTranslate);

          case 3:
            objTranslated = objToTranslate;

            if (!(objToTranslate.en && objToTranslate.en != '')) {
              _context2.next = 9;
              break;
            }

            textToTranslate = objToTranslate.en;
            originLang = 'EN';
            _context2.next = 25;
            break;

          case 9:
            if (!(objToTranslate.es && objToTranslate.es != '')) {
              _context2.next = 14;
              break;
            }

            textToTranslate = objToTranslate.es;
            originLang = 'ES';
            _context2.next = 25;
            break;

          case 14:
            if (!(objToTranslate.pt && objToTranslate.pt != '')) {
              _context2.next = 19;
              break;
            }

            textToTranslate = objToTranslate.pt;
            originLang = 'PT';
            _context2.next = 25;
            break;

          case 19:
            if (!(objToTranslate.fr && objToTranslate.fr != '')) {
              _context2.next = 24;
              break;
            }

            textToTranslate = objToTranslate.fr;
            originLang = 'FR';
            _context2.next = 25;
            break;

          case 24:
            return _context2.abrupt("return", objTranslated);

          case 25:
            parameters = {
              auth_key: deeplKey,
              text: textToTranslate,
              source_lang: originLang
            };
            _context2.prev = 26;

            if (!(!objToTranslate.en || objToTranslate.en == '')) {
              _context2.next = 34;
              break;
            }

            parameters.target_lang = 'EN';
            _context2.next = 31;
            return _axios["default"].post("https://api-free.deepl.com/v2/translate", new URLSearchParams(parameters));

          case 31:
            textTranslated = _context2.sent;
            textTranslated = textTranslated.data.translations[0];
            if (textTranslated && textTranslated.detected_source_language == originLang) objTranslated.en = textTranslated.text;

          case 34:
            if (!(!objToTranslate.es || objToTranslate.es == '')) {
              _context2.next = 41;
              break;
            }

            parameters.target_lang = 'ES';
            _context2.next = 38;
            return _axios["default"].post("https://api-free.deepl.com/v2/translate", new URLSearchParams(parameters));

          case 38:
            textTranslated = _context2.sent;
            textTranslated = textTranslated.data.translations[0];
            if (textTranslated && textTranslated.detected_source_language == originLang) objTranslated.es = textTranslated.text;

          case 41:
            if (!(!objToTranslate.pt || objToTranslate.pt == '')) {
              _context2.next = 48;
              break;
            }

            parameters.target_lang = 'PT';
            _context2.next = 45;
            return _axios["default"].post("https://api-free.deepl.com/v2/translate", new URLSearchParams(parameters));

          case 45:
            textTranslated = _context2.sent;
            textTranslated = textTranslated.data.translations[0];
            if (textTranslated && textTranslated.detected_source_language == originLang) objTranslated.pt = textTranslated.text;

          case 48:
            if (!(!objToTranslate.fr || objToTranslate.fr == '')) {
              _context2.next = 55;
              break;
            }

            parameters.target_lang = 'FR';
            _context2.next = 52;
            return _axios["default"].post("https://api-free.deepl.com/v2/translate", new URLSearchParams(parameters));

          case 52:
            textTranslated = _context2.sent;
            textTranslated = textTranslated.data.translations[0];
            if (textTranslated && textTranslated.detected_source_language == originLang) objTranslated.fr = textTranslated.text;

          case 55:
            _context2.next = 60;
            break;

          case 57:
            _context2.prev = 57;
            _context2.t0 = _context2["catch"](26);
            console.log('ERROR', _context2.t0);

          case 60:
            return _context2.abrupt("return", objTranslated);

          case 61:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[26, 57]]);
  }));

  return function translateString(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.translateString = translateString;