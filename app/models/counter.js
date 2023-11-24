import { mongoose } from '../utils/database';

const Schema = mongoose.Schema;
const CounterModel = new Schema({
    model: String,
    counter: { type: Number, default: 0 },
    iteration: Number
});

const Counter = mongoose.model('Counter', CounterModel);
export default Counter;