import { mongoose } from '../utils/database';

const Schema = mongoose.Schema;
const TokenSchema = new Schema({
	user: {	type: Schema.Types.ObjectId, ref: 'User' },
	staff: {	type: Schema.Types.ObjectId, ref: 'Staff' },
	authToken: { type: String, required: true },
	dateExpired: { type: Date, required: true },
}, { timestamps: { createdAt: '_created', updatedAt: '_modified' } });

const Token = mongoose.model('Token', TokenSchema);
export default Token;
