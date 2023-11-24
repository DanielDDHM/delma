"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../../utils/database");

var Schema = _database.mongoose.Schema;
var PolygonSchema = new Schema({
  type: {
    type: String,
    "enum": ['Polygon'],
    required: true,
    "default": 'Polygon'
  },
  coordinates: {
    type: [[[Number]]],
    required: true,
    "default": [[[0, 0], [0, 0]]]
  }
});
var _default = PolygonSchema;
exports["default"] = _default;