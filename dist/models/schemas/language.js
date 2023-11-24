"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../../utils/database");

var Schema = _database.mongoose.Schema;
var LanguageSchema = new Schema({
  pt: {
    type: String,
    "default": ''
  },
  en: {
    type: String,
    "default": ''
  },
  es: {
    type: String,
    "default": ''
  }
}, {
  _id: false
});
var _default = LanguageSchema;
exports["default"] = _default;