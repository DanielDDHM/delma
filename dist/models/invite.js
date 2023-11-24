"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../utils/database");

var Schema = _database.mongoose.Schema;
var InviteSchema = new Schema({
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff'
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  invitationCode: {
    type: String
  }
}, {
  timestamps: {
    createdAt: '_created',
    updatedAt: '_modified'
  }
});

var Invite = _database.mongoose.model('Invite', InviteSchema);

var _default = Invite;
exports["default"] = _default;