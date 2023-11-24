import { mongoose } from '../utils/database';
import LanguageSchema from './schemas/language';

const Schema = mongoose.Schema;
const BookModel = new Schema({
    _active: { type: Boolean, default: true },
    name: { type: String, required: true },
    value: { type: Number, required: true },
    image: { type: String, required: true },
    bookFile: { type: String },
    bookPreview: { type: String },
    notifyUsers: { type: Boolean, default: false },
    notificationTitle: LanguageSchema,
    notificationDescription: LanguageSchema,
}, { timestamps: { createdAt: '_created', updatedAt: '_modified' } });

const Book = mongoose.model('Book', BookModel);
export default Book;