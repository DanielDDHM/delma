import { mongoose } from '../utils/database';

const Schema = mongoose.Schema;
const PlaylistModel = new Schema({
    _active: { type: Boolean, default: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    musics: [{
        music: { type: Schema.Types.ObjectId, ref: 'Music' },
        bpm: { type: Number, default: 1 }
    }],
}, { timestamps: { createdAt: '_created', updatedAt: '_modified' } });

const Playlist = mongoose.model('Playlist', PlaylistModel);
export default Playlist;