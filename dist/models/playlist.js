"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../utils/database");

var Schema = _database.mongoose.Schema;
var PlaylistModel = new Schema({
  _active: {
    type: Boolean,
    "default": true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  musics: [{
    music: {
      type: Schema.Types.ObjectId,
      ref: 'Music'
    },
    bpm: {
      type: Number,
      "default": 1
    }
  }]
}, {
  timestamps: {
    createdAt: '_created',
    updatedAt: '_modified'
  }
});

var Playlist = _database.mongoose.model('Playlist', PlaylistModel);

var _default = Playlist;
exports["default"] = _default;