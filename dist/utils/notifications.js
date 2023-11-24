"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareSendUsersNotifs = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _lodash = _interopRequireDefault(require("lodash"));

var _notificationToken = _interopRequireDefault(require("../models/notificationToken"));

var _scheduleNotification = _interopRequireDefault(require("../models/scheduleNotification"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var languages = ['pt', 'en'];
var Headers = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': "key=".concat(process.env.FCM_KEY)
  }
};

var prepareSendUsersNotifs = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(type, typeId, usersIds, title, message) {
    var matchQuery, usersTokens, _iterator, _step, tokens, lang, _tokens$ios, ios, _tokens$android, android;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(type != 'notif' && type != 'library' || !notification)) {
              _context.next = 2;
              break;
            }

            throw errors.invalid_parameter;

          case 2:
            matchQuery = usersIds && usersIds.length ? {
              staff: null,
              user: {
                $in: usersIds
              }
            } : {
              staff: null
            };
            console.log("----- VOU ENVIAR USERS: ------", usersIds);
            _context.next = 6;
            return _notificationToken["default"].aggregate([{
              $match: matchQuery
            }, {
              $group: {
                _id: '$language',
                ios: {
                  $addToSet: {
                    $cond: [{
                      $eq: ['$device', 'ios']
                    }, '$token', null]
                  }
                },
                android: {
                  $addToSet: {
                    $cond: [{
                      $eq: ['$device', 'android']
                    }, '$token', null]
                  }
                }
              }
            }, {
              $project: {
                _id: 1,
                ios: {
                  $setDifference: ['$ios', [null]]
                },
                android: {
                  $setDifference: ['$android', [null]]
                }
              }
            }]);

          case 6:
            usersTokens = _context.sent;
            _iterator = _createForOfIteratorHelper(usersTokens);
            _context.prev = 8;

            _iterator.s();

          case 10:
            if ((_step = _iterator.n()).done) {
              _context.next = 21;
              break;
            }

            tokens = _step.value;
            lang = tokens._id, _tokens$ios = tokens.ios, ios = _tokens$ios === void 0 ? [] : _tokens$ios, _tokens$android = tokens.android, android = _tokens$android === void 0 ? [] : _tokens$android;
            console.log("----- VOU ENVIAR NOTIFICA\xC7\xD5ES [".concat(lang, "] ------"));
            console.log("----- ANDROID: [".concat(android.length, "] - IOS: [").concat(ios.length, "] ------"));
            console.log('TITLE: ', title);
            console.log('MESSAGE: ', message);
            _context.next = 19;
            return sendMultiNotifs({
              android: android,
              ios: ios,
              title: title[lang],
              message: message[lang],
              image: image,
              data: {
                notifType: type
              }
            });

          case 19:
            _context.next = 10;
            break;

          case 21:
            _context.next = 26;
            break;

          case 23:
            _context.prev = 23;
            _context.t0 = _context["catch"](8);

            _iterator.e(_context.t0);

          case 26:
            _context.prev = 26;

            _iterator.f();

            return _context.finish(26);

          case 29:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[8, 23, 26, 29]]);
  }));

  return function prepareSendUsersNotifs(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

exports.prepareSendUsersNotifs = prepareSendUsersNotifs;

var uniq = function uniq(t, i, arr) {
  return arr.indexOf(t) === i;
};

var deleteMany = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var notRegistered,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            notRegistered = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : [];

            if (notRegistered.length) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return");

          case 3:
            _context2.next = 5;
            return _notificationToken["default"].deleteMany({
              token: {
                $in: notRegistered
              }
            });

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function deleteMany() {
    return _ref2.apply(this, arguments);
  };
}();

var sendMultiNotifs = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref3) {
    var _ref3$android, android, _ref3$ios, ios, _ref3$title, title, _ref3$message, message, _ref3$image, image, _ref3$data, data, notRegistered, androidTokens, body, chunk, _loop, i, j, iosTokens, _body, _chunk, _loop2, _i, _j;

    return regeneratorRuntime.wrap(function _callee3$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _ref3$android = _ref3.android, android = _ref3$android === void 0 ? [] : _ref3$android, _ref3$ios = _ref3.ios, ios = _ref3$ios === void 0 ? [] : _ref3$ios, _ref3$title = _ref3.title, title = _ref3$title === void 0 ? '' : _ref3$title, _ref3$message = _ref3.message, message = _ref3$message === void 0 ? '' : _ref3$message, _ref3$image = _ref3.image, image = _ref3$image === void 0 ? null : _ref3$image, _ref3$data = _ref3.data, data = _ref3$data === void 0 ? {} : _ref3$data;
            delete data.type;
            notRegistered = [];
            androidTokens = android.filter(uniq);
            console.log("IMAGE", image);

            if (!androidTokens.length) {
              _context5.next = 15;
              break;
            }

            body = {
              title: title,
              body: message,
              data: data,
              priority: 'high',
              sound: 'enabled',
              notification: {
                title: title,
                body: message
              }
            };
            chunk = 500;
            _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(i, j) {
              var limitTokens;
              return regeneratorRuntime.wrap(function _loop$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      limitTokens = androidTokens.slice(i, i + chunk);
                      console.log('LIMIT TOKENS ANDROID: ', limitTokens.length);
                      body['registration_ids'] = limitTokens;
                      _context3.next = 5;
                      return _axios["default"].post('https://fcm.googleapis.com/fcm/send', body, Headers).then(function (res) {
                        var data = res.data;
                        if (!data.failure) return;
                        limitTokens.forEach(function (v, i) {
                          var result = data.results[i];

                          if (result && result.error === 'NotRegistered') {
                            notRegistered.push(v);
                          }
                        });
                      })["catch"](function (err) {
                        return console.log('failed android', err);
                      });

                    case 5:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _loop);
            });
            i = 0, j = androidTokens.length;

          case 10:
            if (!(i < j)) {
              _context5.next = 15;
              break;
            }

            return _context5.delegateYield(_loop(i, j), "t0", 12);

          case 12:
            i += chunk;
            _context5.next = 10;
            break;

          case 15:
            iosTokens = ios.filter(uniq);

            if (!iosTokens.length) {
              _context5.next = 27;
              break;
            }

            _body = {
              data: data,
              notification: {
                title: title,
                body: message,
                data: data,
                sound: 'enabled'
              },
              // content_available: true,
              show_in_foreground: true,
              priority: 'high'
            };
            console.log("BODY IOS", _body);
            _chunk = 500;
            _loop2 = /*#__PURE__*/regeneratorRuntime.mark(function _loop2(_i, _j) {
              var limitTokens;
              return regeneratorRuntime.wrap(function _loop2$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      limitTokens = iosTokens.slice(_i, _i + _chunk);
                      console.log('LIMIT TOKENS IOS: ', limitTokens.length);
                      _body['registration_ids'] = limitTokens;
                      _context4.next = 5;
                      return _axios["default"].post('https://fcm.googleapis.com/fcm/send', _body, Headers).then(function (res) {
                        var data = res.data;
                        if (!data.failure) return;
                        limitTokens.forEach(function (v, i) {
                          var result = data.results[i];

                          if (result && result.error === 'NotRegistered') {
                            notRegistered.push(v);
                          }
                        });
                      })["catch"](function (err) {
                        return console.log('failed ios', err);
                      });

                    case 5:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _loop2);
            });
            _i = 0, _j = iosTokens.length;

          case 22:
            if (!(_i < _j)) {
              _context5.next = 27;
              break;
            }

            return _context5.delegateYield(_loop2(_i, _j), "t1", 24);

          case 24:
            _i += _chunk;
            _context5.next = 22;
            break;

          case 27:
            _context5.next = 29;
            return deleteMany(notRegistered);

          case 29:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee3);
  }));

  return function sendMultiNotifs(_x6) {
    return _ref4.apply(this, arguments);
  };
}();