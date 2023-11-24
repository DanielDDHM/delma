"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../utils/database");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _database.mongoose.Schema;
var StaffSchema = new Schema({
  isActive: {
    type: Boolean,
    "default": true
  },
  isConfirmed: {
    type: Boolean,
    "default": false
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  password: {
    type: String
  },
  language: {
    type: String,
    "default": 'pt'
  },
  photo: {
    type: String
  },
  confirmCode: {
    type: String
  },
  resetCode: {
    type: String
  },
  role: {
    type: String,
    "enum": {
      values: ['sysadmin', 'owner', 'admin']
    },
    "default": 'admin'
  }
}, {
  timestamps: {
    createdAt: '_created',
    updatedAt: '_modified'
  }
});

StaffSchema.methods.comparePassword = function (candidatePassword) {
  try {
    if (this.password) {
      return _bcrypt["default"].compareSync(candidatePassword, this.password);
    }

    return false;
  } catch (error) {
    return false;
  }
};

StaffSchema.methods.displayInfo = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    photo: this.photo,
    role: this.role,
    isActive: this.isActive,
    isConfirmed: this.isConfirmed
  };
};

StaffSchema.plugin(require('mongoose-autopopulate'));

var Staff = _database.mongoose.model('Staff', StaffSchema);

var _default = Staff;
exports["default"] = _default;