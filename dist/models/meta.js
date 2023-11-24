"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../utils/database");

var Schema = _database.mongoose.Schema;
var MetaSchema = new Schema({
  response: {
    type: String
  },
  date: {
    type: Date
  },
  res: {
    results: {
      type: Object
    },
    statusCode: {
      type: Number,
      index: true
    }
  },
  req: {
    url: {
      type: String
    },
    headers: {
      type: Object
    },
    method: {
      type: String,
      index: true
    },
    httpVersion: {
      type: String
    },
    originalUrl: {
      type: String
    },
    query: {
      type: Object
    },
    body: {
      type: Object
    }
  },
  responseTime: {
    type: Number
  }
}, {
  timestamps: {
    createdAt: '_created',
    updatedAt: '_modified'
  }
});

var Meta = _database.mongoose.model('Meta', MetaSchema);

var _default = Meta;
exports["default"] = _default;