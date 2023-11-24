import { mongoose } from '../utils/database';
import LanguageSchema from './schemas/language';

const Schema = mongoose.Schema;
const AlbumModel = new Schema({
    _active: { type: Boolean, default: true },
    name: { type: String, required: true },
    value: { type: Number, required: true },
    image: { type: String, required: true },
    musics: [{ type: Schema.Types.ObjectId, ref: 'Music' }],
    soldIndividual: { type: Boolean, default: false },
    notified: { type: Boolean, default: false },
    notifyUsers: { type: Boolean, default: false },
    notificationTitle: LanguageSchema,
    notificationDescription: LanguageSchema,
}, { timestamps: { createdAt: '_created', updatedAt: '_modified' } });

const Album = mongoose.model('Album', AlbumModel);
export default Album;