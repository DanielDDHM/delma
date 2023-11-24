"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../utils/database");

var Schema = _database.mongoose.Schema;
var StatisticSchema = new Schema({
  date: {
    type: Date
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  screen: {
    type: String
  },
  type: {
    type: String,
    "enum": ['web', 'app']
  },
  deviceId: {
    type: String
  },
  platform: {
    type: String
  },
  os: {
    type: String
  }
}, {
  timestamps: {
    createdAt: '_created',
    updatedAt: '_modified'
  }
});

var Statistic = _database.mongoose.model('Statistic', StatisticSchema);

var _default = Statistic;
exports["default"] = _default;