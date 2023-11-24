"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../utils/database");

var _language = _interopRequireDefault(require("./schemas/language"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _database.mongoose.Schema;
var PageSchema = new Schema({
  title: _language["default"],
  content: _language["default"],
  type: {
    type: String,
    "enum": ['terms', 'privacy']
  },
  isActive: {
    type: Boolean,
    "default": false
  }
});

var Page = _database.mongoose.model('Page', PageSchema);

var _default = Page;
exports["default"] = _default;