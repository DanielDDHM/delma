"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _mongoose["default"].Schema;
var UserSchema = new Schema({
  isConfirmed: {
    type: Boolean,
    "default": false
  },
  confirmationDate: {
    type: Date
  },
  isDelete: {
    type: Boolean,
    "default": false
  },
  isBanned: {
    type: Boolean,
    "default": false
  },
  name: {
    type: String
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    match: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  },
  phone: {
    type: String
  },
  password: {
    type: String
  },
  confirmationCode: {
    type: String,
    "default": null
  },
  resetCode: {
    type: String,
    "default": null
  },
  isGoogle: {
    type: Boolean,
    "default": false
  },
  googleToken: {
    type: String
  },
  isFacebook: {
    type: Boolean,
    "default": false
  },
  facebookToken: {
    type: String
  },
  isApple: {
    type: Boolean,
    "default": false
  },
  appleToken: {
    type: String
  },
  lastUsage: [{
    type: {
      type: String,
      "enum": ['web', 'app']
    },
    os: {
      type: String
    },
    date: {
      type: Date
    }
  }]
}, {
  timestamps: {
    createdAt: '_created',
    updatedAt: '_modified'
  }
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  try {
    if (this.password) {
      return _bcrypt["default"].compareSync(candidatePassword, this.password);
    }

    return false;
  } catch (error) {
    return false;
  }
};

UserSchema.methods.displayInfo = function () {
  return {
    _id: this._id,
    email: this.email,
    phone: this.phone,
    name: this.name,
    isConfirmed: this.isConfirmed,
    lastUsage: this.lastUsage
  };
};

var User = _mongoose["default"].model('User', UserSchema);

var _default = User;
exports["default"] = _default;