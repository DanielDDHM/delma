"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../utils/database");

var Schema = _database.mongoose.Schema;
var NotificationTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    "default": null
  },
  token: {
    type: String,
    unique: true,
    required: true
  },
  device: {
    type: String,
    "enum": {
      values: ['ios', 'android', 'web']
    },
    required: true
  },
  language: {
    type: String,
    "default": 'en'
  }
}, {
  timestamps: {
    createdAt: '_created',
    updatedAt: '_modified'
  }
});

var NotificationToken = _database.mongoose.model('NotificationToken', NotificationTokenSchema);

var _default = NotificationToken;
exports["default"] = _default;