import { mongoose } from '../utils/database';

const Schema = mongoose.Schema;
const MusicModel = new Schema({
    _active: { type: Boolean, default: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    musicFile: { type: String, required: true },
    value: { type: Number, required: true },
    duration: { type: Number, required: true },
}, { timestamps: { createdAt: '_created', updatedAt: '_modified' } });

const Music = mongoose.model('Music', MusicModel);
export default Music;