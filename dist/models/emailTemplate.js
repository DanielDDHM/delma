"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../utils/database");

var _language = _interopRequireDefault(require("./schemas/language"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _database.mongoose.Schema;
var EmailSchema = new Schema({
  key: {
    type: String
  },
  to: {
    type: String
  },
  subject: _language["default"],
  values: _language["default"]
}, {
  timestamps: {
    createdAt: '_created',
    updatedAt: '_modified'
  }
});

var EmailModel = _database.mongoose.model('Email', EmailSchema);

var _default = EmailModel;
exports["default"] = _default;