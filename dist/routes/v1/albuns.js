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

var _album = _interopRequireDefault(require("../../models/album"));

var _music2 = _interopRequireDefault(require("../../models/music"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getAlbum = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req) {
    var id, body, albuns;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = req.params.id, body = req.body;

            if (!id) {
              _context.next = 9;
              break;
            }

            _context.next = 4;
            return _album["default"].findOne({
              _id: id
            }).lean();

          case 4:
            albuns = _context.sent;

            if (albuns) {
              _context.next = 7;
              break;
            }

            throw _errors["default"].not_found;

          case 7:
            _context.next = 12;
            break;

          case 9:
            _context.next = 11;
            return _album["default"].find().lean();

          case 11:
            albuns = _context.sent;

          case 12:
            return _context.abrupt("return", {
              code: 200,
              albuns: albuns
            });

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getAlbum(_x) {
    return _ref.apply(this, arguments);
  };
}();

var postAlbum = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req) {
    var id, body, newAlbum, albuns;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.params.id, body = req.body;

            if (!body.files.length) {
              _context2.next = 5;
              break;
            }

            _context2.next = 4;
            return (0, _upload.uploadImage)(body.files[0], 'albums');

          case 4:
            body.image = _context2.sent;

          case 5:
            _context2.next = 7;
            return (0, _album["default"])(body).save();

          case 7:
            newAlbum = _context2.sent;
            _context2.next = 10;
            return _album["default"].findOne({
              _id: newAlbum._id
            }).lean();

          case 10:
            albuns = _context2.sent;
            return _context2.abrupt("return", {
              code: 200,
              albuns: albuns
            });

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function postAlbum(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var postMusic = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req) {
    var id, body, _iterator, _step, _music, newMusic, music;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id, body = req.body;
            _iterator = _createForOfIteratorHelper(body.files);
            _context3.prev = 2;

            _iterator.s();

          case 4:
            if ((_step = _iterator.n()).done) {
              _context3.next = 12;
              break;
            }

            _music = _step.value;

            if (!(img.fieldName === 'music')) {
              _context3.next = 10;
              break;
            }

            _context3.next = 9;
            return (0, _upload.uploadImage)(_music, 'musics');

          case 9:
            body.music = _context3.sent;

          case 10:
            _context3.next = 4;
            break;

          case 12:
            _context3.next = 17;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](2);

            _iterator.e(_context3.t0);

          case 17:
            _context3.prev = 17;

            _iterator.f();

            return _context3.finish(17);

          case 20:
            newMusic = new _music2["default"](body);
            _context3.next = 23;
            return Promise.all([newMusic.save(), _album["default"].updateOne({
              _id: id
            }, {
              $set: {
                musics: {
                  $push: newMusic._id
                }
              }
            })]);

          case 23:
            _context3.next = 25;
            return _album["default"].findOne({
              _id: newMusic._id
            }).lean();

          case 25:
            music = _context3.sent;
            return _context3.abrupt("return", {
              code: 200,
              music: music
            });

          case 27:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 14, 17, 20]]);
  }));

  return function postMusic(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var putAlbum = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req) {
    var id, body, albuns;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.params.id, body = req.body;
            _context4.next = 3;
            return _album["default"].findOneAndUpdate({
              _id: id
            }, body, {
              "new": true
            }).lean();

          case 3:
            albuns = _context4.sent;
            return _context4.abrupt("return", {
              code: 200,
              albuns: albuns
            });

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function putAlbum(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var activeAlbum = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req) {
    var id, body, albuns;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            id = req.params.id, body = req.body;
            _context5.next = 3;
            return _album["default"].updateOne({
              _id: id
            }, body);

          case 3:
            _context5.next = 5;
            return _album["default"].find().lean();

          case 5:
            albuns = _context5.sent;
            return _context5.abrupt("return", {
              code: 200,
              albuns: albuns
            });

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function activeAlbum(_x5) {
    return _ref5.apply(this, arguments);
  };
}();

var putMusic = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req) {
    var id, body, music;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            id = req.params.id, body = req.body;
            _context6.next = 3;
            return _music2["default"].findOneAndUpdate({
              _id: id
            }, body, {
              "new": true
            }).lean();

          case 3:
            music = _context6.sent;
            return _context6.abrupt("return", {
              code: 200,
              music: music
            });

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function putMusic(_x6) {
    return _ref6.apply(this, arguments);
  };
}();

var deleteAlbum = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req) {
    var id, existingAlbum, albuns;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            id = req.params.id;
            _context7.next = 3;
            return _album["default"].findOne({
              _id: id
            });

          case 3:
            existingAlbum = _context7.sent;
            (0, _upload.deleteImage)(existingAlbum.image, 'albums');
            _context7.next = 7;
            return _album["default"].deleteOne({
              _id: id
            });

          case 7:
            _context7.next = 9;
            return _album["default"].find().lean();

          case 9:
            albuns = _context7.sent;
            return _context7.abrupt("return", {
              code: 200,
              albuns: albuns
            });

          case 11:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function deleteAlbum(_x7) {
    return _ref7.apply(this, arguments);
  };
}();

var deleteMusic = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req) {
    var id, existingMusic, music;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            id = req.params.id;
            _context8.next = 3;
            return _music2["default"].findOne({
              _id: id
            });

          case 3:
            existingMusic = _context8.sent;
            deleteMusic(existingMusic.musicFile, 'musics');
            _context8.next = 7;
            return _music2["default"].deleteOne({
              _id: id
            });

          case 7:
            _context8.next = 9;
            return _music2["default"].find().lean();

          case 9:
            music = _context8.sent;
            return _context8.abrupt("return", {
              code: 200,
              music: music
            });

          case 11:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function deleteMusic(_x8) {
    return _ref8.apply(this, arguments);
  };
}(); //Router


var albumRouter = function albumRouter(errorHandler) {
  var router = _express["default"].Router();

  router.get('/:id?', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res, next) {
      var _yield$getAlbum, code, albuns;

      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return getAlbum(req, res, next);

            case 2:
              _yield$getAlbum = _context9.sent;
              code = _yield$getAlbum.code;
              albuns = _yield$getAlbum.albuns;
              (0, _misc.response)(req, res, code, 'ALBUM_FOUND', 'albuns found', {
                albuns: albuns
              });

            case 6:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));

    return function (_x9, _x10, _x11) {
      return _ref9.apply(this, arguments);
    };
  }())).post('/', (0, _index.checkToken)(), (0, _index.formDataParser)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req, res, next) {
      var _yield$postAlbum, code, albuns;

      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return postAlbum(req, res, next);

            case 2:
              _yield$postAlbum = _context10.sent;
              code = _yield$postAlbum.code;
              albuns = _yield$postAlbum.albuns;
              (0, _misc.response)(req, res, code, 'ALBUM_CREATED', 'albuns has been created', {
                albuns: albuns
              });

            case 6:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));

    return function (_x12, _x13, _x14) {
      return _ref10.apply(this, arguments);
    };
  }())).post('/:id/music', (0, _index.checkToken)(), (0, _index.formDataParser)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(req, res, next) {
      var _yield$postMusic, code, albuns;

      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return postMusic(req, res, next);

            case 2:
              _yield$postMusic = _context11.sent;
              code = _yield$postMusic.code;
              albuns = _yield$postMusic.albuns;
              (0, _misc.response)(req, res, code, 'MUSIC_CREATED', 'music has been created', {
                albuns: albuns
              });

            case 6:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));

    return function (_x15, _x16, _x17) {
      return _ref11.apply(this, arguments);
    };
  }())).put('/:id', (0, _index.checkToken)(), (0, _index.formDataParser)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(req, res, next) {
      var _yield$putAlbum, code, albuns;

      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return putAlbum(req, res, next);

            case 2:
              _yield$putAlbum = _context12.sent;
              code = _yield$putAlbum.code;
              albuns = _yield$putAlbum.albuns;
              (0, _misc.response)(req, res, code, 'ALBUM_UPDATED', 'albuns has been updated', {
                albuns: albuns
              });

            case 6:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }));

    return function (_x18, _x19, _x20) {
      return _ref12.apply(this, arguments);
    };
  }())).put('/:id/music/:idMusic', (0, _index.checkToken)(), (0, _index.formDataParser)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(req, res, next) {
      var _yield$putMusic, code, albuns;

      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return putMusic(req, res, next);

            case 2:
              _yield$putMusic = _context13.sent;
              code = _yield$putMusic.code;
              albuns = _yield$putMusic.albuns;
              (0, _misc.response)(req, res, code, 'MUSIC_UPDATED', 'music has been updated', {
                albuns: albuns
              });

            case 6:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    }));

    return function (_x21, _x22, _x23) {
      return _ref13.apply(this, arguments);
    };
  }())).patch('/:id', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(req, res, next) {
      var _yield$activeAlbum, code, albuns;

      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return activeAlbum(req, res, next);

            case 2:
              _yield$activeAlbum = _context14.sent;
              code = _yield$activeAlbum.code;
              albuns = _yield$activeAlbum.albuns;
              (0, _misc.response)(req, res, code, 'ALBUM_ACTIVATED', 'albuns has been activated', {
                albuns: albuns
              });

            case 6:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    }));

    return function (_x24, _x25, _x26) {
      return _ref14.apply(this, arguments);
    };
  }()))["delete"]('/:id', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(req, res, next) {
      var _yield$deleteAlbum, code, albuns;

      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return deleteAlbum(req, res, next);

            case 2:
              _yield$deleteAlbum = _context15.sent;
              code = _yield$deleteAlbum.code;
              albuns = _yield$deleteAlbum.albuns;
              (0, _misc.response)(req, res, code, 'ALBUM_DELETED', 'albuns has been deleted', {
                albuns: albuns
              });

            case 6:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    }));

    return function (_x27, _x28, _x29) {
      return _ref15.apply(this, arguments);
    };
  }()))["delete"]('/:id/music/:idMusic', (0, _index.checkToken)(), (0, _index.checkRole)('sysadmin', 'owner', 'admin'), errorHandler( /*#__PURE__*/function () {
    var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(req, res, next) {
      var _yield$deleteMusic, code, albuns;

      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return deleteMusic(req, res, next);

            case 2:
              _yield$deleteMusic = _context16.sent;
              code = _yield$deleteMusic.code;
              albuns = _yield$deleteMusic.albuns;
              (0, _misc.response)(req, res, code, 'MUSIC_DELETED', 'albuns has been deleted', {
                albuns: albuns
              });

            case 6:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    }));

    return function (_x30, _x31, _x32) {
      return _ref16.apply(this, arguments);
    };
  }()));
  return router;
};

var router = albumRouter;
exports.router = router;