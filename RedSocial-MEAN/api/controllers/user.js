'use strict'
//modulos
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

//modelos
var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication');

//metodo de prueba
function home(req, res){
    res.status(200).send({
        message: "Hola home en el servidor"
    });
}

//metodo de prueba
function pruebas(req, res){
    res.status(200).send({
        message: "Hola pruebas en el servidor"
    });
}

/**
 * Metodo para agregar un usuario
 * recibe una solicitud con los datos del usuario
 * (name, surname, nick, email, password) como datos obligatorios
 * recibe una respuesta para mandar respuestas del servidor
 * return estado 200 con el json de usuario
 * caso contrario return estados de falla con un mensaje
 * @param {*} req 
 * @param {*} res 
 */
function saveUser(req, res){
    
    var params = req.body;
    var user = new User();

    if(params.name && params.surname && params.nick && params.email && params.password ){

            user.name = params.name;
            user.surname = params.surname;
            user.nick = params.nick;
            user.email = params.email;
            user.role = 'ROLE_USER';
            user.image = null;

            //Controlar usuarios duplicados en el email y nick
            User.find({
                $or: [
                    {nick: user.nick.toLowerCase()},
                    {nick: user.nick},
                    {email: user.email.toLowerCase()},
                    {email: user.email}
                ]
            }).exec((err,users) => {
                
                if(err) return res.status(500).send({message: "error en la peticion de usuarios"});

                if(users && users.length >= 1){

                    return res.status(200).send({message: "El usuario ya existe"});
                }
                else{
                    //cifrado de la contraseña
                    bcrypt.hash(params.password, null, null, (err, hash) => {

                        user.password = hash;

                        //guardado base de datos mongoose
                        user.save((err,userStored) =>{

                            if (err) return res.status(500).send({message: "error al guardar el usuario"});
                            
                            if (userStored) {
                                res.status(200).send({user: userStored });
                            } else{
                                res.status(404).send({message:"no se ha registrado el usuario"});
                            }
                        });
                    });
                }
            });  
    }   
    else{
        res.status(200).json({
            message: "envia todos los campos necesarios"
        });
    }
}

/**
 * Metodo para identificar un usuario
 * recibe una solicitud con los datos del usuario
 * (email, password, getToken(opcional))
 * recibe una respuesta para mandar respuestas del servidor
 * return json estado 200 con los datos del usuario ocultando contraseña
 * return el token de Autentificacion del usuario si es solicitado con true
 * caso contrario return estados de falla con un mensaje
 * @param {*} req 
 * @param {*} res 
 */
function loginUser(req,res){

    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email}, (err, user) => {

        if (err) return res.status(500).send({message: "Error en la peticion"});

        if (user) {
            bcrypt.compare(password, user.password, (err,check) => {
                if (check) {   
                    //si llega un token
                    if (params.getToken) {
                        //generar y devolver token
                       return res.status(200).send({
                           token: jwt.createToken(user)
                       });
                    }
                    else{
                        //devolver datos del usuraio
                        //evitar mostrar la contraseña, que solo quede a nivel backend
                        user.password = undefined;
                        res.status(200).send({user});
                    }
                }
                else{
                    return res.status(404).send({message: "El usuario no se ha podido identificar"});
                }
            })
        }
        else{
            return res.status(404).send({message: "El usuario no se ha podido identificar"});
        }
    });
}

/**
 * Metodo para obtener datos de un usuario 
 * asi como saber si el usuario logeado sigue a ese usuario  (following)
 * y si el usuario sigue al usuario logeado (followed)
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getUser(req,res) {
    var userId = req.params.id;

    User.findById(userId, (err,user) =>{

        if (err) return res.status(500).send({message: 'Error en la peticion'});
        if (!user) return res.status(404).send({message: 'El usuario no existe'});

        //al ser async-await tiene un metodo de promesa then, el cual recibe el retorno
        followThisUser(req.user.sub, userId).then((value) =>{
                user.password = undefined;
                res.status(200).send({
                    user,
                    following: value.following,
                    followed: value.followed
                });
            });
    });
}

/**
 * Funcion sincrona utilizada para obtener el following y followed
 * de la funcion getUser
 * @param {*} identity_user_id usuario logeado
 * @param {*} userId usuario de la peticion
 */
 async function followThisUser(identity_user_id, userId){
    try {
        //busca donde user sea el usuario logeado y followed sea el usuario de la peticion
        //¿sigo a ese usuario?
        //si encuentra coincidencia regresa el registro que cumpla con las coincidencias
        var following = await Follow.findOne({ user: identity_user_id, followed: userId }).exec()
            .then((following) => {
                return following;
            })
            .catch((err) => {
                return handleError(err);
            });
        
        //busca donde user sea el usuario de la peticion y followed sea el usuario logeado
        //¿Me sigue ese usuario?
        //si encuentra coincidencia regresa el registro que cumpla con las coincidencias
        var followed = await Follow.findOne({ user: userId, followed: identity_user_id }).exec()
            .then((followed) => {
                return followed;
            })
            .catch((err) => {
                return handleError(err);
            });

        return { following, followed };

    } catch (e) {
        console.log(e);
    } 
}

/**
 * Metodo para devolver un listado de usuarios paginado
 * con los usuarios, un total usuarios y Numero de paginas
 * asi como los usuarios que sigue el usuario logeado
 * y los usuarios que siguen al usuario logeado
 * 
 * @param {*} req
 * @param {*} res
 */
function getUsers(req,res) {
    //id del usuario logeado
    var identity_user_id = req.user.sub;

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;
    
    //predecated
    User.find().sort('name').paginate(page, itemsPerPage, (err,users, total) =>{
        if (err) return res.status(500).send({message: 'Error en la peticion'});
        if(!users) return res.status(404).send({message: 'No se encontraron usuarios disponibles'});

        followUsersIds(identity_user_id).then((value) =>{
            return res.status(200).send({
                users,
                user_following: value.following,
                user_follow_me: value.followed,
                total,
                pages: Math.ceil(total/itemsPerPage)
            });
        });
        
    });
    
}

/**
 * Funcion sincrona utilizada para obtener el following y followed
 * de la funcion getUsers
 * @param {*} identity_user_id usuario logeado
 */
async function followUsersIds(identity_user_id){

    //select(), sirve para incluir o excluir campos, en este caso se excluye el id, el __v y el user
    var following = await Follow.find({"user": identity_user_id}).select({"_id":0, "__v":0, "user":0})     .exec()
            .then((follows) => {

                var follows_clean = [];
                follows.forEach((follow) =>{
                    follows_clean.push(follow.followed);
                });

                return follows_clean;
            })

            .catch((err) =>{
                return handleError(err);
            });

    //select(), sirve para incluir o excluir campos, en este caso se excluye el id, el __v y el followed
    var followed = await Follow.find({"followed": identity_user_id}).select({"_id":0, "__v":0, "followed":0})
        .exec()
            .then((follows) => {

                var follows_clean = [];
                follows.forEach((follow) =>{
                    follows_clean.push(follow.user);
                });

                return follows_clean;
            })

            .catch((err) =>{
                return handleError(err);
            });
    
    return {following,followed};
}

/**
 * Metodo para tener el conteo de 
 * following (siguiendo)
 * followed (seguido)
 * publicaciones realizadas
 * @param {*} req 
 * @param {*} res 
 */
function getCounters(req, res){

    var userId = req.user.sub;

    if(req.params.id){
        userId = req.params.id;
    }
    
    getCountFollow(userId).then((value) => {
        res.status(200).send(value);
    });
    
}

/**
 * Metodo para obtener las estadisticas
 * necesarias para el metodo getCounters
 * @param {*} userId 
 */
async function getCountFollow(userId){

    var following = await Follow.countDocuments({"user": userId}).exec()
        .then((count)=>{
            return count;
        })

        .catch((err) => {
            return handleError(err);
        });
    
    var followed = await Follow.countDocuments({"followed": userId}).exec()
        .then((count) => {
            return count;
        })

        .catch((err) => {
            return handleError(err);
        });
    
    var publications = await Publication.countDocuments({"user": userId}).exec()
        .then((count) =>{
            return count;
        })
        .catch((err) =>{
            return handleError(err);
        });
    
    return {
        following,
        followed,
        publications
    };
}

/**
 * Metodo para Editar un usuario
 * @param {*} req 
 * @param {*} res 
 */
function updateUser(req,res) {
    var userId = req.params.id;
    var update = req.body;

    //borrar la propiedad password del cuerpo
    delete update.password;

    //Si el ID del usuario logeado no es el mismo que el ID de la peticioin
    //No es su cuenta, por lo que no puede editar datos de alguien mas
    if (userId != req.user.sub) return res.status(500).send({message: 'No tienes permiso para actualizar esta informacion'});

    //usuarios cuyo email ó nick sean igual a los 
    //datos mandados
    User.find({
        $or: [
            {nick: update.nick},
            {email: update.email}
        ]
    }).exec((err, users) =>{

        //bandera para ver si hay coincidencias
        var userFlag = false;

        //por cada usuario
        users.forEach((user)=>{
            //el id de usuario en la DB es distinto al id del mandado
            //No son el mismo usuario, pero tienen algun dato igual
            if(user._id != userId){
                //se actualiza la bandera
                userFlag = true;
            }
        });

        // si es true, implica que existen mas usuarios con mismo email y nick
        if(userFlag){
            return res.status(500).send({message: "Los datos ya estan en uso"});
        }
        //si no hay coincidencias, se puede actualizar los datos
        User.findByIdAndUpdate(userId, update, {new: true}, (err,userUpdate) =>{

            if (err) return res.status(500).send({message: 'Error en la peticion'});
            if(!userUpdate) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
        
             return res.status(200).send({user: userUpdate});
        });
    });
}

function removeFilesofUploads(res, file_path, message){
    fs.unlink(file_path, (err) =>{
        return res.status(200).send({message: message});
    });
}

/**
 * Subir archivos de imagen/avatar de usuario
 * @param {*} req 
 * @param {*} res 
 */
function uploadImage(req,res){

    var userId = req.params.id;

    //si hay archivos en la solicitud
    if(req.files){

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

        //Si el ID del usuario logeado no es el mismo que el ID de la peticioin
        //No es su cuenta, por lo que no puede editar datos de alguien mas
        if (userId != req.user.sub) {
            return removeFilesofUploads(res, file_path, 'No tienes permiso para editar esta informacion')
        }

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif' ) {

            //actualizar documento de usuario logeado
            User.findByIdAndUpdate(userId, {image: file_name}, {new: true}, (err,userUpdate) =>{

                if (err) return res.status(500).send({message: 'Error en la peticion'});
                if(!userUpdate) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

                return res.status(200).send({user: userUpdate});
            });
        } else {
            return removeFilesofUploads(res, file_path, 'Extencion no valida');
        }

    } else{
        return res.status(200).send({message: 'No se han subido Archivos'});
    }
}

/**
 * recuperar archivos de imagen/avatar de usuario
 * @param {*} req 
 * @param {*} res 
 */
function getImageFile(req,res){

    var image_file = req.params.imageFile;
    var path_file = './uploads/users/' + image_file;

    fs.exists(path_file, (exists) =>{
        if(exists){
            //devuelve el fichero en bruto
           return  res.sendFile(path.resolve(path_file));
        } else{
           return  res.status(200).send({message: 'No existe la imagen'})
        }
    })

}


module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    getCounters,
    updateUser,
    uploadImage,
    getImageFile
}