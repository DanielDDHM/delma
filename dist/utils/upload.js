"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadS3 = exports.uploadMultipleImages = exports.uploadImage = exports.deleteImage = void 0;

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var uploadMultipleImages = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, pluralModel) {
    var body, links, _iterator, _step, file, fileExt, timestamp, location, fileLink;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            body = req.body;
            links = [];
            _iterator = _createForOfIteratorHelper(body.files);
            _context.prev = 3;

            _iterator.s();

          case 5:
            if ((_step = _iterator.n()).done) {
              _context.next = 19;
              break;
            }

            file = _step.value;

            if (!(file && file.fileName)) {
              _context.next = 17;
              break;
            }

            fileExt = file.contentType.split('/')[1].toLowerCase();
            timestamp = new Date().getTime();
            location = "".concat(process.env.NODE_ENV, "/images/").concat(pluralModel, "/").concat(timestamp, ".").concat(fileExt);
            _context.next = 13;
            return uploadS3(location, file.file, file.contentType);

          case 13:
            fileLink = _context.sent;

            if (fileLink) {
              _context.next = 16;
              break;
            }

            throw errors.internal_error;

          case 16:
            links.push(fileLink.Location);

          case 17:
            _context.next = 5;
            break;

          case 19:
            _context.next = 24;
            break;

          case 21:
            _context.prev = 21;
            _context.t0 = _context["catch"](3);

            _iterator.e(_context.t0);

          case 24:
            _context.prev = 24;

            _iterator.f();

            return _context.finish(24);

          case 27:
            return _context.abrupt("return", {
              code: 200,
              fileLink: links.length === 1 ? links[0] : links
            });

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 21, 24, 27]]);
  }));

  return function uploadMultipleImages(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.uploadMultipleImages = uploadMultipleImages;

var uploadImage = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(file, pluralModel) {
    var fileExt, timestamp, location, fileLink;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            fileExt = file.contentType.split('/')[1].toLowerCase();
            timestamp = new Date().getTime();
            location = "".concat(process.env.NODE_ENV, "/images/").concat(pluralModel, "/").concat(timestamp, ".").concat(fileExt);
            _context2.next = 5;
            return uploadS3(location, file.file, file.contentType);

          case 5:
            fileLink = _context2.sent;

            if (fileLink) {
              _context2.next = 8;
              break;
            }

            throw errors.internal_error;

          case 8:
            return _context2.abrupt("return", fileLink.Location);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function uploadImage(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.uploadImage = uploadImage;

var deleteImage = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(img, pluralModel) {
    var fileName, location;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            fileName = img.split('/');
            fileName = fileName[fileName.length - 1];
            location = "".concat(process.env.NODE_ENV, "/images/").concat(pluralModel, "/").concat(fileName);
            _context3.next = 5;
            return deleteS3(location);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function deleteImage(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.deleteImage = deleteImage;

var uploadS3 = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(filename, file, contentType) {
    var s3, s3Params, upload;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;

            _awsSdk["default"].config.update({
              accessKeyId: "".concat(process.env.AWS_ACCESS_KEY_ID),
              secretAccessKey: "".concat(process.env.AWS_SECRET_ACCESS_KEY),
              region: 'eu-central-1'
            });

            s3 = new _awsSdk["default"].S3();
            s3Params = {
              Bucket: 'delma-assets',
              Key: filename,
              Body: file,
              ACL: 'public-read',
              ContentType: contentType
            };
            _context4.next = 6;
            return s3.upload(s3Params).promise();

          case 6:
            upload = _context4.sent;
            return _context4.abrupt("return", upload);

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 10]]);
  }));

  return function uploadS3(_x7, _x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}();

exports.uploadS3 = uploadS3;

var deleteS3 = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(filename) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt("return", new Promise(function (resolve, reject) {
              try {
                _awsSdk["default"].config.update({
                  accessKeyId: "".concat(process.env.AWS_ACCESS_KEY_ID),
                  secretAccessKey: "".concat(process.env.AWS_SECRET_ACCESS_KEY),
                  region: 'eu-central-1'
                });

                var s3 = new _awsSdk["default"].S3();
                var s3Params = {
                  Bucket: 'delma-assets',
                  Key: filename
                };
                s3.deleteObject(s3Params, function (err, data) {
                  if (err) reject();
                  resolve(data);
                });
              } catch (err) {
                console.log(err);
              }
            }));

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function deleteS3(_x10) {
    return _ref5.apply(this, arguments);
  };
}();