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

var _upload = require("../../utils/upload");

var _book = _interopRequireDefault(require("../../models/book"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getBook = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req) {
    var id, books;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = req.params.id;

            if (!id) {
              _context.next = 9;
              break;
            }

            _context.next = 4;
            return _book["default"].findOne({
              _id: id
            }).lean();

          case 4:
            books = _context.sent;

            if (books) {
              _context.next = 7;
              break;
            }

            throw _errors["default"].not_found;

          case 7:
            _context.next = 12;
            break;

          case 9:
            _context.next = 11;
            return _book["default"].find().lean();

          case 11:
            books = _context.sent;

          case 12:
            return _context.abrupt("return", {
              code: 200,
              books: books
            });

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getBook(_x) {
    return _ref.apply(this, arguments);
  };
}();

var postBook = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req) {
    var id, body, _iterator, _step, file, newBook, books;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.params.id, body = req.body;
            _iterator = _createForOfIteratorHelper(body.files);
            _context2.prev = 2;

            _iterator.s();

          case 4:
            if ((_step = _iterator.n()).done) {
              _context2.next = 20;
              break;
            }

            file = _step.value;

            if (!(file.fieldName === 'image')) {
              _context2.next = 10;
              break;
            }

            _context2.next = 9;
            return (0, _upload.uploadImage)(file, 'books');

          case 9:
            body.image = _context2.sent;

          case 10:
            if (!(file.fieldName === 'bookFile')) {
              _context2.next = 14;
              break;
            }

            _context2.next = 13;
            return (0, _upload.uploadImage)(file, 'books');

          case 13:
            body.bookFile = _context2.sent;

          case 14:
            if (!(file.fieldName === 'bookPreview')) {
              _context2.next = 18;
              break;
            }

            _context2.next = 17;
            return (0, _upload.uploadImage)(file, 'books');

          case 17:
            body.bookPreview = _context2.sent;

          case 18:
            _context2.next = 4;
            break;

          case 20:
            _context2.next = 25;
            break;

          case 22:
            _context2.prev = 22;
            _context2.t0 = _context2["catch"](2);

            _iterator.e(_context2.t0);

          case 25:
            _context2.prev = 25;

            _iterator.f();

            return _context2.finish(25);

          case 28:
            _context2.next = 30;
            return (0, _book["default"])(body).save();

          case 30:
            newBook = _context2.sent;
            _context2.next = 33;
            return _book["default"].findOne({
              _id: newBook._id
            }).lean();

          case 33:
            books = _context2.sent;
            return _context2.abrupt("return", {
              code: 200,
              books: books
            });

          case 35:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 22, 25, 28]]);
  }));

  return function postBook(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var putBook = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req) {
    var id, body, existingBook, _iterator2, _step2, file, books;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id, body = req.body;
            _context3.next = 3;
            return _book["default"].findOne({
              _id: id
            });

          case 3:
            existingBook = _context3.sent;

            if (!body.files) {
              _context3.next = 38;
              break;
            }

            _iterator2 = _createForOfIteratorHelper(body.files);
            _context3.prev = 6;

            _iterator2.s();

          case 8:
            if ((_step2 = _iterator2.n()).done) {
              _context3.next = 30;
              break;
            }

            file = _step2.value;

            if (!(file.fieldName === 'image')) {
              _context3.next = 16;
              break;
            }

            _context3.next = 13;
            return (0, _upload.deleteImage)(existingBook.image, 'books');

          case 13:
            _context3.next = 15;
            return (0, _upload.uploadImage)(file, 'books');

          case 15:
            body.image = _context3.sent;

          case 16:
            if (!(file.fieldName === 'bookFile')) {
              _context3.next = 22;
              break;
            }

            _context3.next = 19;
            return (0, _upload.deleteImage)(existingBook.bookFile, 'books');

          case 19:
            _context3.next = 21;
            return (0, _upload.uploadImage)(file, 'books');

          case 21:
            body.bookFile = _context3.sent;

          case 22:
            if (!(file.fieldName === 'bookPreview')) {
              _context3.next = 28;
              break;
            }

            _context3.next = 25;
            return (0, _upload.deleteImage)(existingBook.bookPreview, 'books');

          case 25:
            _context3.next = 27;
            return (0, _upload.uploadImage)(file, 'books');

          case 27:
            body.bookPreview = _context3.sent;

          case 28:
            _context3.next = 8;
            break;

          case 30:
            _context3.next = 35;
            break;

          case 32:
            _context3.prev = 32;
            _context3.t0 = _context3["catch"](6);

            _iterator2.e(_context3.t0);

          case 35:
            _context3.prev = 35;

            _iterator2.f();

            return _context3.finish(35);

          case 38:
            _context3.next = 40;
            return _book["default"].findOneAndUpdate({
              _id: id
            }, body, {
              "new": true
            }).lean();

          case 40:
            books = _context3.sent;
            return _context3.abrupt("return", {
              code: 200,
              books: books
            });

          case 42:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[6, 32, 35, 38]]);
  }));

  return function putBook(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var activeBook = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req) {
    var id, body, books;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.params.id, body = req.body;
            _context4.next = 3;
            return _book["default"].updateOne({
              _id: id
            }, body);

          case 3:
            _context4.next = 5;
            return _book["default"].find().lean();

          case 5:
            books = _context4.sent;
            return _context4.abrupt("return", {
              code: 200,
              books: books
            });

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function activeBook(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var deleteBook = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req) {
    var id, existingBook, books;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            id = req.params.id;
            _context5.next = 3;
            return _book["default"].findOne({
              _id: id
            });

          case 3:
            existingBook = _context5.sent;
            (0, _upload.deleteImage)(existingBook.image, 'books');
            (0, _upload.deleteImage)(existingBook.bookFile, 'books');
            (0, _upload.deleteImage)(existingBook.bookPreview, 'books');
            _context5.next = 9;
            return _book["default"].deleteOne({
              _id: id
            });

          case 9:
            _context5.next = 11;
            return _book["default"].find().lean();

          case 11:
            books = _context5.sent;
            return _context5.abrupt("return", {
              code: 200,
              books: books
            });

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function deleteBook(_x5) {
    return _ref5.apply(this, arguments);
  };
}(); //Router


var bookRouter = function bookRouter(errorHandler) {
  var router = _express["default"].Router();

  router.get('/:id?', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res, next) {
      var _yield$getBook, code, books;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return getBook(req, res, next);

            case 2:
              _yield$getBook = _context6.sent;
              code = _yield$getBook.code;
              books = _yield$getBook.books;
              (0, _misc.response)(req, res, code, 'BOOK_FOUND', 'Book found', {
                books: books
              });

            case 6:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x6, _x7, _x8) {
      return _ref6.apply(this, arguments);
    };
  }())).post('/', (0, _index.checkToken)(), (0, _index.formDataParser)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res, next) {
      var _yield$postBook, code, books;

      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return postBook(req, res, next);

            case 2:
              _yield$postBook = _context7.sent;
              code = _yield$postBook.code;
              books = _yield$postBook.books;
              (0, _misc.response)(req, res, code, 'BOOK_CREATED', 'Book has been created', {
                books: books
              });

            case 6:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function (_x9, _x10, _x11) {
      return _ref7.apply(this, arguments);
    };
  }())).put('/:id', (0, _index.checkToken)(), (0, _index.formDataParser)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res, next) {
      var _yield$putBook, code, books;

      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return putBook(req, res, next);

            case 2:
              _yield$putBook = _context8.sent;
              code = _yield$putBook.code;
              books = _yield$putBook.books;
              (0, _misc.response)(req, res, code, 'BOOK_UPDATED', 'Book has been updated', {
                books: books
              });

            case 6:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));

    return function (_x12, _x13, _x14) {
      return _ref8.apply(this, arguments);
    };
  }())).patch('/:id', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res, next) {
      var _yield$activeBook, code, books;

      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return activeBook(req, res, next);

            case 2:
              _yield$activeBook = _context9.sent;
              code = _yield$activeBook.code;
              books = _yield$activeBook.books;
              (0, _misc.response)(req, res, code, 'BOOK_ACTIVATED', 'Book has been activated', {
                books: books
              });

            case 6:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));

    return function (_x15, _x16, _x17) {
      return _ref9.apply(this, arguments);
    };
  }()))["delete"]('/:id', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req, res, next) {
      var _yield$deleteBook, code, books;

      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return deleteBook(req, res, next);

            case 2:
              _yield$deleteBook = _context10.sent;
              code = _yield$deleteBook.code;
              books = _yield$deleteBook.books;
              (0, _misc.response)(req, res, code, 'BOOK_DELETED', 'Book has been deleted', {
                books: books
              });

            case 6:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));

    return function (_x18, _x19, _x20) {
      return _ref10.apply(this, arguments);
    };
  }()));
  return router;
};

var router = bookRouter;
exports.router = router;