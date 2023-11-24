"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../utils/database");

var _language = _interopRequireDefault(require("./schemas/language"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _database.mongoose.Schema;
var AlbumModel = new Schema({
  _active: {
    type: Boolean,
    "default": true
  },
  name: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  musics: [{
    type: Schema.Types.ObjectId,
    ref: 'Music'
  }],
  soldIndividual: {
    type: Boolean,
    "default": false
  },
  notified: {
    type: Boolean,
    "default": false
  },
  notifyUsers: {
    type: Boolean,
    "default": false
  },
  notificationTitle: _language["default"],
  notificationDescription: _language["default"]
}, {
  timestamps: {
    createdAt: '_created',
    updatedAt: '_modified'
  }
});

var Album = _database.mongoose.model('Album', AlbumModel);

var _default = Album;
exports["default"] = _default;