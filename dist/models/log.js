"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../utils/database");

var Schema = _database.mongoose.Schema;
var LogSchema = new Schema({
  level: {
    type: String
  },
  message: {
    type: String
  },
  response: {
    type: String
  },
  description: {
    type: String
  },
  date: {
    type: Date
  },
  token: {
    type: String
  },
  method: {
    type: String
  },
  userId: {
    type: String
  },
  code: {
    type: Number
  },
  source: {
    type: String
  },
  meta: {
    type: Schema.Types.ObjectId,
    ref: 'Meta'
  }
}, {
  timestamps: {
    createdAt: '_created',
    updatedAt: '_modified'
  }
});

var Log = _database.mongoose.model('Log', LogSchema);

var _default = Log;
exports["default"] = _default;