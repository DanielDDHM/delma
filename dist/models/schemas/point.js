"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../../utils/database");

var Schema = _database.mongoose.Schema;
var PointSchema = new Schema({
  type: {
    $type: String,
    "enum": ['Point'],
    required: true,
    "default": 'Point'
  },
  coordinates: {
    $type: [Number],
    required: true,
    "default": [0, 0]
  }
}, {
  _id: false,
  typeKey: '$type'
});
var _default = PointSchema;
exports["default"] = _default;