"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../utils/database");

var _language = _interopRequireDefault(require("./schemas/language"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _database.mongoose.Schema;
var ScheduleNotificationSchema = new Schema({
  sent: {
    type: Boolean,
    "default": false
  },
  scheduleDate: {
    type: Date
  },
  title: _language["default"],
  description: _language["default"]
}, {
  timestamps: {
    createdAt: '_created',
    updatedAt: '_modified'
  }
});

var ScheduleNotification = _database.mongoose.model('ScheduleNotification', ScheduleNotificationSchema);

var _default = ScheduleNotification;
exports["default"] = _default;