"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../utils/database");

var _counter2 = _interopRequireDefault(require("../models/counter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _database.mongoose.Schema;
var OrderModel = new Schema({
  _active: {
    type: Boolean,
    "default": true
  },
  requestNumber: {
    type: String,
    unique: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  amount: {
    type: Number
  },
  status: {
    type: String,
    "enum": {
      values: ['pending', 'paid'],
      message: 'INVALID_CATEGORY'
    },
    "default": 'pending',
    index: true
  },
  items: [{
    type: {
      type: String,
      "enum": {
        values: ['Album', 'Music', 'Book'],
        message: 'INVALID_CATEGORY'
      },
      "default": 'Album',
      index: true
    },
    itemId: {
      type: Schema.Types.ObjectId,
      index: true
    },
    amount: {
      type: Number
    }
  }],
  paymentMethod: {
    type: String,
    "default": ""
  },
  transaction: {
    type: String,
    "default": ""
  }
}, {
  timestamps: {
    createdAt: '_created',
    updatedAt: '_modified'
  }
});

var addNumber = function addNumber(next) {
  _counter2["default"].findOne({
    model: 'Order'
  }, function (err, counter) {
    if (err) return next(err); // Ainda não existe contador?
    // Criar.

    if (!counter) {
      var _counter = new _counter2["default"]({
        model: 'Order',
        counter: 1,
        iteration: 1
      });

      _counter.save(function (e) {
        if (e) return next(e); // Visto ser o primeiro do modelo,
        // Atribuir o primeiro número.

        this.requestNumber = '01' + new Date().getFullYear() + '0001';
        return next();
      }.bind(this));
    } else {
      var _i = counter.counter == 9999 ? counter.iteration + 1 : counter.iteration;

      var _c = counter.counter == 9999 ? 1 : counter.counter + 1;

      _i = _i < 10 ? '0' + _i : _i;

      _counter2["default"].update({
        model: 'Order'
      }, {
        counter: _c,
        iteration: _i
      }, function (e) {
        if (e) return next(e); // Adicionar tantos leading zeros quantoßs necessários
        // de modo a ficarmos com um código de 4 caracteres.

        var _code = _c.toString();

        for (var i = _code.length; i < 4; i++) {
          _code = '0' + _code;
        }

        this.requestNumber = _i.toString() + new Date().getFullYear() + _code;
        return next();
      }.bind(this));
    }
  }.bind(this));
}; // PRE HOOKS


OrderModel.pre('save', addNumber);

var Order = _database.mongoose.model('Order', OrderModel);

var _default = Order;
exports["default"] = _default;