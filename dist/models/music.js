"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../utils/database");

var Schema = _database.mongoose.Schema;
var MusicModel = new Schema({
  _active: {
    type: Boolean,
    "default": true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  musicFile: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  }
}, {
  timestamps: {
    createdAt: '_created',
    updatedAt: '_modified'
  }
});

var Music = _database.mongoose.model('Music', MusicModel);

var _default = Music;
exports["default"] = _default;