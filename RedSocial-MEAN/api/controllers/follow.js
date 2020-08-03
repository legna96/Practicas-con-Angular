'use strict'

//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

//modelos
var User = require('../models/user');
var Follow = require('../models/follow');

function prueba(req, res) {
    res.status(200).send({ message: 'Hola mundo desde el controlador Follow' });
}

/**
 * Metodo para seguir un usuario
 * @param {*} req 
 * @param {*} res 
 */
function saveFollow(req, res) {

    var params = req.body;
    var follow = Follow();

    //usuario logeado
    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save((err, followStored) => {

        if (err) return res.status(500).send({ message: 'Error al guardar seguimiento' });
        if (!followStored) return res.status(404).send({ message: 'El seguimiento no se ha guardado' });

        return res.status(200).send({ follow: followStored });
    });

}
/**
 * Metodo para dejar de seguir un usuario
 * @param {*} req 
 * @param {*} res 
 */
function deleteFollow(req, res) {
    //usuario logeado
    var userId = req.user.sub;
    var follorId = req.params.id;

    Follow.find({ 'user': userId, 'followed': follorId }).remove((err) => {

        if (err) return res.status(500).send({ message: 'Error al dejar de seguir a este usuario' });
        return res.status(200).send({ message: 'El follow se ha eliminado' });

    });
}

/**
 * Metodo para obtener los usuarios que el usuario logeado sigue 
 * de forma paginada
 * 
 * (que sigo)
 * 
 * si no se manda ningun parametro se listan los usuarios que sigue el que esta logeado
 * si se mandan los dos parametros (los dos) se buscan los usuarios seguidos por el usuario 
 * del paramtro y pagina mandados
 * @param {*} req 
 * @param {*} res 
 */
function getFollowingUsers(req, res) {

    //usuario logeado
    var userId = req.user.sub;

    //por si nos mandan el usuario por la url
    //y la pagina
    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    //por si nos mandan la pagina por url
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    //listar 4 usuarios por pagina
    var itemsPerPage = 4;

    //buscar todos los follows donde el usuario logeado es el seguidor
    //populate subtituye el campo id por todo el documento de la informacion de ese id (en este caso con los campos del User)
    Follow.find({ user: userId }).populate({ path: 'followed' }).
        paginate(page, itemsPerPage, (err, follows, total) => {
            if (err) return res.status(500).send({ message: 'Error en el Servidor' });
            if (!follows) return res.status(404).send({ message: 'No sigues a ningun usuario' });

            followUsersIds(req.user.sub).then((value) => {

                return res.status(200).send({
                    total,//esto es igual que poner total: total
                    pages: Math.ceil(total / itemsPerPage),
                    user_following: value.following,
                    user_follow_me: value.followed,
                    follows//esto es igual que poner follows: follows
                });
            });
        });
}

/**
 * Funcion sincrona utilizada para obtener el following y followed
 * de la funcion getUsers
 * @param {*} identity_user_id usuario logeado
 */
async function followUsersIds(identity_user_id) {

    //select(), sirve para incluir o excluir campos, en este caso se excluye el id, el __v y el user
    var following = await Follow.find({ "user": identity_user_id }).select({ "_id": 0, "__v": 0, "user": 0 }).exec()
        .then((follows) => {

            var follows_clean = [];
            follows.forEach((follow) => {
                follows_clean.push(follow.followed);
            });

            return follows_clean;
        })

        .catch((err) => {
            return handleError(err);
        });

    //select(), sirve para incluir o excluir campos, en este caso se excluye el id, el __v y el followed
    var followed = await Follow.find({ "followed": identity_user_id }).select({ "_id": 0, "__v": 0, "followed": 0 })
        .exec()
        .then((follows) => {

            var follows_clean = [];
            follows.forEach((follow) => {
                follows_clean.push(follow.user);
            });

            return follows_clean;
        })

        .catch((err) => {
            return handleError(err);
        });

    return { following, followed };
}


/**
* Metodo para obtener los usuarios que siguen al usuario logeado 
* de forma paginada
*
* (que me siguen)
*
* si no se manda ningun parametro se listan los usuarios que siguen al usuario logeado
* si se mandan los dos parametros (los dos) se buscan los usuarios que siguen al usuario 
* del paramtro y pagina mandados
*
* @param {*} req 
* @param {*} res 
*/
function getFollowedUsers(req, res) {

    //usuario logeado
    var userId = req.user.sub;

    //por si nos mandan el usuario por la url
    //y la pagina
    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    //por si nos mandan la pagina por url
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    //listar 4 usuarios por pagina
    var itemsPerPage = 4;

    //buscar todos los follows donde el usuario logeado sea seguido por otros usuarios
    //populate subtituye el campo id por todo el documento de la informacion de ese id (en este caso con los campos del User y followed)
    Follow.find({ followed: userId }).populate('user').
        paginate(page, itemsPerPage, (err, follows, total) => {
            if (err) return res.status(500).send({ message: 'Error en el Servidor' });
            if (!follows) return res.status(404).send({ message: 'No te sigue ningun usuario' });

            followUsersIds(req.user.sub).then((value) => {

                return res.status(200).send({
                    total,//esto es igual que poner total: total
                    pages: Math.ceil(total / itemsPerPage),
                    user_following: value.following,
                    user_follow_me: value.followed,
                    follows//esto es igual que poner follows: follows
                });
            });
        });
}

/**
 * Metodo para devolver el listado de usuarios
 * @param {*} req 
 * @param {*} res 
 */
function getMyFollows(req, res) {

    //user --> 'el que sigue'
    //followed --> 'el que es seguido'

    var userId = req.user.sub;

    //busca donde el user sea el usuario logeado
    var find = Follow.find({ user: userId });

    //si mandan parametro followed, busca donde el followed sea el usuario logeado
    if (req.params.followed) {
        find = Follow.find({ followed: userId });
    }

    find.populate('user followed').exec((err, follows) => {
        if (err) return res.status(500).send({ message: 'Error en el Servidor' });
        if (!follows) return res.status(404).send({ message: 'No sigues a ningun usuario' });

        return res.status(200).send({ follows });
    });
}

module.exports = {
    prueba,
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows
}