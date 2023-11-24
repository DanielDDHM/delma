import { mongoose } from '../utils/database';
import Counter from '../models/counter';

const Schema = mongoose.Schema;
const OrderModel = new Schema({
    _active: { type: Boolean, default: true },
    requestNumber: { type: String, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    amount: { type: Number },
    status: { type: String, enum: { values: ['pending', 'paid'], message: 'INVALID_CATEGORY' }, default: 'pending', index: true },
    items: [{
        type: { type: String, enum: { values: ['Album', 'Music', 'Book'], message: 'INVALID_CATEGORY' }, default: 'Album', index: true },
        itemId: { type: Schema.Types.ObjectId, index: true },
        amount: { type: Number },
    }],
    paymentMethod: { type: String, default: "" },
    transaction: { type: String, default: "" },
}, { timestamps: { createdAt: '_created', updatedAt: '_modified' } });

const addNumber = function (next) {
    Counter.findOne({ model: 'Order' }, function (err, counter) {
        if (err) return next(err);
        // Ainda não existe contador?
        // Criar.
        if (!counter) {
            let _counter = new Counter({ model: 'Order', counter: 1, iteration: 1 });
            _counter.save(function (e) {
                if (e) return next(e);

                // Visto ser o primeiro do modelo,
                // Atribuir o primeiro número.
                this.requestNumber = '01' + new Date().getFullYear() + '0001';
                return next();
            }.bind(this));
        } else {
            let _i = (counter.counter == 9999) ? (counter.iteration + 1) : counter.iteration;
            let _c = (counter.counter == 9999) ? 1 : (counter.counter + 1);

            _i = (_i < 10) ? '0' + _i : _i;

            Counter.update({ model: 'Order' }, { counter: _c, iteration: _i }, function (e) {
                if (e) return next(e);

                // Adicionar tantos leading zeros quantoßs necessários
                // de modo a ficarmos com um código de 4 caracteres.
                let _code = _c.toString();
                for (let i = _code.length; i < 4; i++) {
                    _code = '0' + _code;
                }

                this.requestNumber = _i.toString() + new Date().getFullYear() + _code;
                return next();
            }.bind(this));
        }
    }.bind(this));
};

// PRE HOOKS
OrderModel.pre('save', addNumber);
const Order = mongoose.model('Order', OrderModel);
export default Order;