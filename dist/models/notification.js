"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../utils/database");

var _language = _interopRequireDefault(require("../models/schemas/language"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _database.mongoose.Schema;
var NotificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    "default": null
  },
  title: {
    type: _language["default"]
  },
  message: {
    type: _language["default"]
  },
  read: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: {
    createdAt: '_created',
    updatedAt: '_modified'
  }
});

var Notification = _database.mongoose.model('Notification', NotificationSchema);

var _default = Notification;
exports["default"] = _default;