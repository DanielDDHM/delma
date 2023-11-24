// Packages
import express from 'express';
import _ from 'lodash';

// Utils
import { checkToken, checkRole, formDataParser } from './index';
import { response } from '../../utils/misc';
import errors from '../../utils/errors';
import { uploadImage, deleteImage} from '../../utils/upload';


// Models
import Album from '../../models/album';
import Music from '../../models/music';

const getAlbum = async (req) => {
    const { params: {id}, body } = req;
    let albuns;

    if (id) {
    albuns = await Album.findOne({ _id: id }).lean();
        if (!albuns) throw errors.not_found;
    } else {
    albuns = await Album.find().lean();
    }

    return { code: 200, albuns };
}

const postAlbum = async (req) => {
    const { params: { id }, body } = req;
    if(body.files.length) body.image = await uploadImage(body.files[0], 'albums');

    const newAlbum = await Album(body).save();
    const albuns = await Album.findOne({ _id: newAlbum._id }).lean();
    

    return { code: 200, albuns };
}

const postMusic = async (req) => {
    const { params: { id }, body } = req;

    for (const music of body.files) {
        if (img.fieldName === 'music') body.music = await uploadImage(music, 'musics');
    }

    const newMusic = new Music(body);

    await Promise.all([
        newMusic.save(),
        Album.updateOne({_id: id},{$set: {musics: {$push: newMusic._id}}})
    ])

    const music = await Album.findOne({ _id: newMusic._id }).lean();

    return { code: 200, music };
}

const putAlbum = async (req) => {
    const { params: { id }, body } = req;
    const albuns = await Album.findOneAndUpdate({ _id: id }, body, { new: true }).lean();

    return { code: 200, albuns };
}

const activeAlbum = async (req) => {
    const { params: { id }, body } = req;
    await Album.updateOne({ _id: id }, body);
    const albuns = await Album.find().lean()
    return { code: 200, albuns };
}

const putMusic = async (req) => {
    const { params: { id }, body } = req;
    const music = await Music.findOneAndUpdate({ _id: id }, body, { new: true }).lean();

    return { code: 200, music };
}

const deleteAlbum = async (req) => {
    const { params: { id } } = req;
    const existingAlbum = await Album.findOne({ _id: id });

    deleteImage(existingAlbum.image, 'albums')

    await Album.deleteOne({ _id: id });
    const albuns = await Album.find().lean();

    return { code: 200, albuns };
}

const deleteMusic = async (req) => {
    const { params: { id } } = req;

    const existingMusic = await Music.findOne({ _id: id });

    deleteMusic(existingMusic.musicFile, 'musics')

    await Music.deleteOne({ _id: id });
    const music = await Music.find().lean();

    return { code: 200, music };
}

//Router
const albumRouter = errorHandler => {
    const router = express.Router();
    router
        .get('/:id?', checkToken(), checkRole('sysadmin', 'owner', 'admin'), errorHandler(async (req, res, next) => {
            const { code, albuns } = await getAlbum(req,res,next);
            response(req, res, code, 'ALBUM_FOUND', 'albuns found', { albuns });
        }))

        .post('/', checkToken(), formDataParser(), checkRole('sysadmin', 'owner', 'admin'), errorHandler(async (req, res, next) => {
            const { code, albuns } = await postAlbum(req,res,next);
            response(req,res,code, 'ALBUM_CREATED', 'albuns has been created', { albuns });
        }))

        .post('/:id/music', checkToken(), formDataParser(), checkRole('sysadmin', 'owner', 'admin'), errorHandler(async (req, res, next) => {
            const { code, albuns } = await postMusic(req,res,next);
            response(req,res,code, 'MUSIC_CREATED', 'music has been created', { albuns });
        }))

        .put('/:id', checkToken(), formDataParser(), checkRole('sysadmin', 'owner', 'admin'), errorHandler(async (req, res, next) => {
            const { code, albuns } = await putAlbum(req, res, next);
            response(req, res, code, 'ALBUM_UPDATED', 'albuns has been updated', { albuns });
        }))

        .put('/:id/music/:idMusic', checkToken(), formDataParser(), checkRole('sysadmin', 'owner', 'admin'), errorHandler(async (req, res, next) => {
            const { code, albuns } = await putMusic(req, res, next);
            response(req, res, code, 'MUSIC_UPDATED', 'music has been updated', { albuns });
        }))

        .patch('/:id', checkToken(), checkRole('sysadmin', 'owner', 'admin'), errorHandler(async (req, res, next) => {
            const { code, albuns } = await activeAlbum(req, res, next);
            response(req, res, code, 'ALBUM_ACTIVATED', 'albuns has been activated', { albuns });
        }))

        .delete('/:id', checkToken(), checkRole('sysadmin', 'owner', 'admin'), errorHandler(async (req, res, next) => {
            const { code, albuns } = await deleteAlbum(req,res,next);
            response(req,res,code, 'ALBUM_DELETED', 'albuns has been deleted', { albuns });
        }))

        .delete('/:id/music/:idMusic', checkToken(), checkRole('sysadmin', 'owner', 'admin'), errorHandler(async (req, res, next) => {
            const { code, albuns } = await deleteMusic(req,res,next);
            response(req,res,code, 'MUSIC_DELETED', 'albuns has been deleted', { albuns });
        }));

    return router;
};

export const router = albumRouter;