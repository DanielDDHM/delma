"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../utils/database");

var Schema = _database.mongoose.Schema;
var CounterModel = new Schema({
  model: String,
  counter: {
    type: Number,
    "default": 0
  },
  iteration: Number
});

var Counter = _database.mongoose.model('Counter', CounterModel);

var _default = Counter;
exports["default"] = _default;