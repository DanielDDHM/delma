"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendEmail = void 0;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _lodash = _interopRequireDefault(require("lodash"));

var _emailTemplate = _interopRequireDefault(require("../models/emailTemplate"));

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var awsKeyId = process.env.AWS_ACCESS_KEY_ID;
var awsAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

var sendEmail = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(templateName, subjectObj, mapObj, to) {
    var lang,
        bcc,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            lang = _args2.length > 4 && _args2[4] !== undefined ? _args2[4] : 'pt';
            bcc = _args2.length > 5 && _args2[5] !== undefined ? _args2[5] : false;
            return _context2.abrupt("return", new Promise( /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve) {
                var emailTemplate, params, sendPromise;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _awsSdk["default"].config.update({
                          awsKeyId: awsKeyId,
                          awsAccessKey: awsAccessKey,
                          region: 'eu-west-1'
                        });

                        _context.next = 3;
                        return _emailTemplate["default"].findOne({
                          key: templateName
                        }).lean();

                      case 3:
                        emailTemplate = _context.sent;

                        if (emailTemplate && emailTemplate.to) {
                          to = emailTemplate.to.split(';');
                        }

                        if (emailTemplate.subject && !subjectObj) {
                          subjectObj = emailTemplate.subject[lang];
                        }

                        _context.t0 = {
                          ToAddresses: Array.isArray(to) ? to : [to]
                        };
                        _context.t1 = emailTranslator;
                        _context.next = 10;
                        return templatePicker(templateName, lang || 'pt');

                      case 10:
                        _context.t2 = _context.sent;
                        _context.t3 = mapObj;
                        _context.t4 = (0, _context.t1)(_context.t2, _context.t3);
                        _context.t5 = {
                          Charset: 'UTF-8',
                          Data: _context.t4
                        };
                        _context.t6 = {
                          Html: _context.t5
                        };
                        _context.t7 = {
                          Charset: 'UTF-8',
                          Data: subjectObj || 'Template'
                        };
                        _context.t8 = {
                          Body: _context.t6,
                          Subject: _context.t7
                        };
                        _context.t9 = "".concat(_config["default"].emailTags.app_name, " <no-reply@delmanicolace.com>");
                        params = {
                          Destination: _context.t0,
                          Message: _context.t8,
                          Source: _context.t9
                        };
                        sendPromise = new _awsSdk["default"].SES({
                          apiVersion: '2010-12-01'
                        }).sendEmail(params).promise();
                        sendPromise.then(function () {
                          resolve();
                        })["catch"](function (err) {
                          console.log("errrr", err);
                          Promise.reject(err);
                        });

                      case 21:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x5) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function sendEmail(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.sendEmail = sendEmail;

var emailTranslator = function emailTranslator(template, mapObj) {
  for (var key in mapObj) {
    template = template.replace(new RegExp("<%".concat(key, "%>"), 'g'), mapObj[key]);
  }

  return template;
};

var templatePicker = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(key, lang) {
    var validTemplate, t, emailTemplate;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            validTemplate = null;
            _context3.next = 3;
            return _emailTemplate["default"].find({});

          case 3:
            t = _context3.sent;
            _context3.next = 6;
            return _emailTemplate["default"].findOne({
              key: key
            }).lean();

          case 6:
            emailTemplate = _context3.sent;
            validTemplate = emailTemplate.values[lang];
            return _context3.abrupt("return", validTemplate);

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function templatePicker(_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();