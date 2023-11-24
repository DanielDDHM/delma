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

var _page = _interopRequireDefault(require("../../models/page"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getPages = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req) {
    var id, pages;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = req.params.id;
            pages = [];

            if (!id) {
              _context.next = 16;
              break;
            }

            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
              _context.next = 9;
              break;
            }

            _context.next = 6;
            return _page["default"].findOne({
              _id: id
            });

          case 6:
            pages = _context.sent;
            _context.next = 12;
            break;

          case 9:
            _context.next = 11;
            return _page["default"].findOne({
              type: id
            });

          case 11:
            pages = _context.sent;

          case 12:
            if (pages) {
              _context.next = 14;
              break;
            }

            throw _errors["default"].not_found;

          case 14:
            _context.next = 19;
            break;

          case 16:
            _context.next = 18;
            return _page["default"].find();

          case 18:
            pages = _context.sent;

          case 19:
            return _context.abrupt("return", {
              code: 200,
              pages: pages
            });

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getPages(_x) {
    return _ref.apply(this, arguments);
  };
}();

var putPage = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req) {
    var id, body, page;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.params.id, body = req.body;
            _context2.next = 3;
            return _page["default"].findOneAndUpdate({
              _id: id
            }, body, {
              "new": true
            });

          case 3:
            page = _context2.sent;
            return _context2.abrupt("return", {
              code: 200,
              page: page
            });

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function putPage(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var patchPage = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req) {
    var id, body, pages;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id, body = req.body;

            if (!(body.isActive == null)) {
              _context3.next = 3;
              break;
            }

            throw _errors["default"].required_fields_empty;

          case 3:
            _context3.next = 5;
            return _page["default"].updateOne({
              _id: id
            }, {
              isActive: body.isActive
            });

          case 5:
            _context3.next = 7;
            return _page["default"].find().lean();

          case 7:
            pages = _context3.sent;
            return _context3.abrupt("return", {
              code: 200,
              pages: pages
            });

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function patchPage(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var pagesRouter = function pagesRouter(errorHandler) {
  var router = _express["default"].Router();

  router.get('/:id?', errorHandler( /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
      var _yield$getPages, code, pages;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return getPages(req, res, next);

            case 2:
              _yield$getPages = _context4.sent;
              code = _yield$getPages.code;
              pages = _yield$getPages.pages;
              (0, _misc.response)(req, res, code, 'PAGES_FOUND', 'Found Pages', {
                pages: pages
              });

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x4, _x5, _x6) {
      return _ref4.apply(this, arguments);
    };
  }())).put('/:id', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res, next) {
      var _yield$putPage, code, page;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return putPage(req, res, next);

            case 2:
              _yield$putPage = _context5.sent;
              code = _yield$putPage.code;
              page = _yield$putPage.page;
              (0, _misc.response)(req, res, code, 'PAGE_UPDATED', 'Page has been updated', {
                page: page
              });

            case 6:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function (_x7, _x8, _x9) {
      return _ref5.apply(this, arguments);
    };
  }())).patch('/:id', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res, next) {
      var _yield$patchPage, code, pages;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return patchPage(req, res, next);

            case 2:
              _yield$patchPage = _context6.sent;
              code = _yield$patchPage.code;
              pages = _yield$patchPage.pages;
              (0, _misc.response)(req, res, code, 'PAGE_ACTIVE_UPDATED', 'Page has been updated', {
                pages: pages
              });

            case 6:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function (_x10, _x11, _x12) {
      return _ref6.apply(this, arguments);
    };
  }()));
  return router;
};

var router = pagesRouter;
exports.router = router;