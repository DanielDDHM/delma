"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = exports.getCountries = void 0;

var _express = _interopRequireDefault(require("express"));

var _index = require("./index");

var _misc = require("../../utils/misc");

var _errors = _interopRequireDefault(require("../../utils/errors"));

var _country = _interopRequireDefault(require("../../models/country"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getCountries = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req) {
    var id, source, countries, selectFields;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = req.params.id, source = req.headers.source;

            if (!id) {
              _context.next = 7;
              break;
            }

            _context.next = 4;
            return _country["default"].findOne({
              _id: id
            }).select('_id name states timezones').lean();

          case 4:
            countries = _context.sent;
            _context.next = 11;
            break;

          case 7:
            selectFields = source === 'bo' ? '_id name states timezones' : '_id name flag callingCodes translations alpha2Code alpha3Code';
            _context.next = 10;
            return _country["default"].find().select(selectFields).lean();

          case 10:
            countries = _context.sent;

          case 11:
            return _context.abrupt("return", {
              code: 207,
              countries: countries
            });

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getCountries(_x) {
    return _ref.apply(this, arguments);
  };
}(); //Router


exports.getCountries = getCountries;

var countriesRouter = function countriesRouter(errorHandler) {
  var router = _express["default"].Router();

  router.get('/:id?', errorHandler( /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
      var _yield$getCountries, code, countries;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return getCountries(req, res, next);

            case 2:
              _yield$getCountries = _context2.sent;
              code = _yield$getCountries.code;
              countries = _yield$getCountries.countries;
              (0, _misc.response)(req, res, code, 'COUNTRIES_FOUND', 'Found Countries', {
                countries: countries
              });

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2, _x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }()));
  return router;
};

var router = countriesRouter;
exports.router = router;