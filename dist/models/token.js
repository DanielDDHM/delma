"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../utils/database");

var Schema = _database.mongoose.Schema;
var TokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff'
  },
  authToken: {
    type: String,
    required: true
  },
  dateExpired: {
    type: Date,
    required: true
  }
}, {
  timestamps: {
    createdAt: '_created',
    updatedAt: '_modified'
  }
});

var Token = _database.mongoose.model('Token', TokenSchema);

var _default = Token;
exports["default"] = _default;