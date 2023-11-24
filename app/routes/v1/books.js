// Packages
import express from 'express';
import _ from 'lodash';

// Utils
import { checkToken, checkRole, formDataParser } from './index';
import { response } from '../../utils/misc';
import errors from '../../utils/errors';
import { uploadImage, deleteImage, uploadArchive, deleteArchive } from '../../utils/upload';


// Models
import Book from '../../models/book';

const getBook = async (req) => {
    const { params: {id} } = req;
    let books;

    if (id) {
      books = await Book.findOne({ _id: id }).lean();
        if (!books) throw errors.not_found;
    } else {
      books = await Book.find().lean();
    }

    return { code: 200, books };
}

const postBook = async (req) => {
    const { params: { id }, body } = req;

    for (const file of body.files) {
        if (file.fieldName === 'image') body.image = await uploadImage(file, 'books');
        if (file.fieldName === 'bookFile') body.bookFile = await uploadImage(file, 'books');
        if (file.fieldName === 'bookPreview') body.bookPreview = await uploadImage(file, 'books');
    }

    const newBook = await Book(body).save();
    const books = await Book.findOne({ _id: newBook._id }).lean();

    return { code: 200, books };
}

const putBook = async (req) => {
    const { params: { id }, body } = req;
    const existingBook = await Book.findOne({ _id: id });
    if(body.files){
        for (const file of body.files) {
            if (file.fieldName === 'image') {
                await deleteImage(existingBook.image, 'books');
                body.image = await uploadImage(file, 'books');
            }
            if (file.fieldName === 'bookFile') {
                await deleteImage(existingBook.bookFile, 'books');
                body.bookFile = await uploadImage(file, 'books');
            }
            if (file.fieldName === 'bookPreview') {
                await deleteImage(existingBook.bookPreview, 'books');
                body.bookPreview = await uploadImage(file, 'books');
            }
        }
    }
    const books = await Book.findOneAndUpdate({ _id: id }, body, { new: true }).lean();

    return { code: 200, books };
}

const activeBook = async (req) => {
    const { params: { id }, body } = req;
    await Book.updateOne({ _id: id }, body);
    const books = await Book.find().lean()
    return { code: 200, books };
}

const deleteBook = async (req) => {
    const { params: { id } } = req;
    const existingBook = await Book.findOne({ _id: id });

    deleteImage(existingBook.image, 'books')
    deleteImage(existingBook.bookFile, 'books')
    deleteImage(existingBook.bookPreview, 'books')

    await Book.deleteOne({ _id: id });
    const books = await Book.find().lean();

    return { code: 200, books };
}

//Router
const bookRouter = errorHandler => {
    const router = express.Router();
    router
        .get('/:id?', checkToken(), checkRole('sysadmin', 'owner', 'admin'), errorHandler(async (req, res, next) => {
            const { code, books } = await getBook(req,res,next);
            response(req, res, code, 'BOOK_FOUND', 'Book found', { books });
        }))

        .post('/', checkToken(), formDataParser(), checkRole('sysadmin', 'owner', 'admin'), errorHandler(async (req, res, next) => {
            const { code, books } = await postBook(req,res,next);
            response(req,res,code, 'BOOK_CREATED', 'Book has been created', { books });
        }))

        .put('/:id', checkToken(), formDataParser(), checkRole('sysadmin', 'owner', 'admin'), errorHandler(async (req, res, next) => {
            const { code, books } = await putBook(req, res, next);
            response(req, res, code, 'BOOK_UPDATED', 'Book has been updated', { books });
        }))

        .patch('/:id', checkToken(), checkRole('sysadmin', 'owner', 'admin'), errorHandler(async (req, res, next) => {
          const { code, books } = await activeBook(req, res, next);
          response(req, res, code, 'BOOK_ACTIVATED', 'Book has been activated', { books });
      }))

        .delete('/:id', checkToken(), checkRole('sysadmin', 'owner', 'admin'), errorHandler(async (req, res, next) => {
            const { code, books } = await deleteBook(req,res,next);
            response(req,res,code, 'BOOK_DELETED', 'Book has been deleted', { books });
        }));
    return router;
};

export const router = bookRouter;