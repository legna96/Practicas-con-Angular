'use strict'

var mongoose = require('mongoose');
var moment = require('moment');
var path = require('path');
var fs = require('fs');

//models
var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication');

function probando(req, res) {
    res.status(200).send({ message: 'Hola desde Publicacion' });
}

/**
 * Metodo para crear una publicacion
 * @param {*} req el texto
 * @param {*} res 
 */
function savePublication(req, res) {
    var params = req.body;

    //si no llega el parametro texto
    if (!params.text) return res.status(200).send({ message: 'La publicacion debe contener un texto' });

    var publication = new Publication();

    publication.text = params.text;
    publication.file = 'null';
    publication.created_at = moment().unix();
    publication.user = req.user.sub;

    publication.save((err, publicationStored) => {
        if (err) return res.status(500).send({ message: 'Error al crear Publicacion' });
        if (!publicationStored) return res.status(404).send({ message: 'Publicacion no encontrada' });

        return res.status(200).send({ publication: publicationStored });
    });

}

/**
 * Metodo para obtener Todas las publicaciones
 * en general
 * @param {*} req 
 * @param {*} res 
 */
function getPublications(req, res) {

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    //obtener todos los usuarios que sigue el usuario logeado
    Follow.find({ user: req.user.sub }).populate('followed').exec()
        .then((follows) => {
            var follows_clean = [];
            follows.forEach((follow) => {
                //arreglo de los usuarios seguidos
                follows_clean.push(follow.followed);
            });

            //agregamos id del usuario logeado
            follows_clean.push(req.user.sub);

            //obtener las publicaciones de los usuarios seguidos
            Publication.find({
                user: { "$in": follows_clean }
            }).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
                if (err) return res.status(500).send({ message: 'Error al devolver publicaciones' });
                if (!publications) return res.status(404).send({ message: 'No hay publicaciones' });
                return res.status(200).send({
                    total_items: total,
                    pages: Math.ceil(total / itemsPerPage),
                    page,
                    itemsPerPage,
                    publications

                })
            })
        })
        .catch((err) => {
            return handleError(err);
        });
}

/**
 * Metodo para tener todas las publicaciones 
 * de un solo usuario
 * @param {*} req 
 * @param {*} res 
 */
function getPublicationsUser(req, res) {

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 4;

    var user = req.user.sub;

    if(req.params.user){
        user = req.params.user;
    }

    //obtener las publicaciones de el usuario logeado
    Publication.find({ user: user }).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {

        if (err) return res.status(500).send({ message: 'Error al devolver publicaciones' });

        if (!publications) return res.status(404).send({ message: 'No hay publicaciones' });

        return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total / itemsPerPage),
            page,
            itemsPerPage,
            publications

        });
    });
}

/**
 * Metodo para obtener una publicacion
 * @param {*} req el id
 * @param {*} res la publicacion
 */
function getPublication(req, res) {
    var publicacionID = req.params.id;

    Publication.findById(publicacionID, (err, publication) => {
        if (err) return res.status(500).send({ message: 'Error al devolver publicacion' });
        if (!publication) return res.status(404).send({ message: 'No existe la publicacion' });

        return res.status(200).send({ publication });
    });
}

/**
 * Metodo para eliminar una publicacion
 * @param {*} req 
 * @param {*} res 
 */
function deletePublication(req, res) {

    var publicacionID = req.params.id;

    //busca que la publicacion a borrar donde el user sea del usuario logueado y que el id el solicitado
    Publication.findOne({ "user": req.user.sub, "_id": publicacionID }).exec()
        .then((publication) => {
            publication.remove((err) => {
                if (err) return res.status(500).send({ message: 'Error al elminar publicacion' });
                return res.status(200).send({ message: 'Publicacion Eliminada' });
            });
        })
        .catch((err) => {
            return res.status(404).send({ message: 'Error.! publicacion no encontrada para este usuario' });
        });
}

/**
 * Subir archivos de imagen/publicacion
 * @param {*} req 
 * @param {*} res 
 */
function uploadImage(req, res) {

    var publicationID = req.params.id;

    //si hay archivos en la solicitud
    if (req.files) {

        //el nombre del parametro es image
        var file_path = req.files.image.path;
        //console.log(file_path);

        var file_split = file_path.split('\\');
        //console.log(file_split);

        var file_name = file_split[2];
        //console.log(file_name);

        var ext_split = file_name.split('\.');
        //console.log(ext_split);

        var file_ext = ext_split[1];
        //console.log(file_ext);

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {

            Publication.findOne({ 'user': req.user.sub, '_id': publicationID }).exec()
                .then((publication) => {
                    if (publication) {
                        //actualizar documento de la publicacion
                        Publication.findByIdAndUpdate(publicationID, { file: file_name }, { new: true }, (err, publicationUpdate) => {
                            if (err) return res.status(500).send({ message: 'Error en la peticion' });
                            if (!publicationUpdate) return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                            return res.status(200).send({ publication: publicationUpdate });
                        });
                    } else {
                        return removeFilesofUploads(res, file_path, 'No tienes permiso para actualizar esta publicacion');
                    }
                })
                .catch((err) => {
                    return removeFilesofUploads(res, file_path, 'Publicacion no encontrada');
                })

        } else {
            return removeFilesofUploads(res, file_path, 'Extencion no valida');
        }

    } else {
        return res.status(200).send({ message: 'No se han subido imagenes' });
    }
}

function removeFilesofUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(500).send({ message: message });
    });
}

/**
 * recuperar archivos de imagen/avatar de usuario
 * @param {*} req 
 * @param {*} res 
 */
function getImageFile(req, res) {

    var image_file = req.params.imageFile;
    var path_file = './uploads/publications/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            //devuelve el fichero en bruto
            return res.sendFile(path.resolve(path_file));
        } else {
            return res.status(200).send({ message: 'No existe la imagen' })
        }
    })

}

module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublicationsUser,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}