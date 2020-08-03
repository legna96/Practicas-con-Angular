'use strict'

//modulos
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-pagination');
var moment = require('moment');

//modelos
var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function probando(req,res){
    res.status(200).send({message: 'Hola que tal desde Message'});
}

/**
 * Metodo para agregar un mensaje
 * @param {*} req 
 * @param {*} res 
 */
function saveMessage(req,res){
    var params = req.body;

    if(!params.text || !params.receiver) return res.status(200).send({message: 'datos insuficientes'})
    var message = new Message();

    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = 'false';

    message.save((err,messageStored) => {
        if(err) return res.status(500).send({message: 'Error al guardar mensaje'});
        if(!messageStored) return res.status(404).send({message: 'mensaje no encontrado'});
        return res.status(200).send({message: messageStored});
    });
}

/**
 * Metodo para obtener los mensajes que haya recibido
 * algun usuario logeado
 * @param {*} req 
 * @param {*} res 
 */
function getReceivedMessages(req, res){
    var userID = req.user.sub;

    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;

    //el segundo parametro del populate, muestra solo los campos solicitados
    //otra forma de hacer esto seria con el metodo select como se hizo antes
    Message.find({receiver: userID}).populate('emitter receiver', 'name surname _id nick image').sort('-created_at').paginate(page, itemsPerPage, (err, messages, total) =>{
        if(err) return res.status(500).send({message: 'Error en la peticion al servidor'});
        if(!messages) return res.status(404).send({message: 'No hay mensajes'});

        return res.status(200).send({
            total,
            pages: Math.ceil(total/itemsPerPage),
            messages
        });
    });
}

/**
 * Metodo para obtener los mensajes que el usuario logeado
 * haya mandado
 * @param {*} req 
 * @param {*} res 
 */
function getEmittedMessages(req, res){
    var userID = req.user.sub;

    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;

    //el segundo parametro del populate, muestra solo los campos solicitados
    //otra forma de hacer esto seria con el metodo select como se hizo antes
    Message.find({emitter: userID}).populate('emitter receiver', 'name surname _id nick image').sort('-created_at').paginate(page, itemsPerPage, (err, messages, total) =>{
        if(err) return res.status(500).send({message: 'Error en la peticion al servidor'});
        if(!messages) return res.status(404).send({message: 'No hay mensajes'});

        return res.status(200).send({
            total,
            pages: Math.ceil(total/itemsPerPage),
            messages
        });
    });
}

/**
 * Metodo para contar mensajes no leidos
 * @param {*} req 
 * @param {*} res 
 */
function unViewedMessages(req, res){

    var userID = req.user.sub;

    Message.countDocuments({receiver: userID, viewed: 'false'}).exec()
        .then((count) => {
            return res.status(200).send({unviewed: count});
        })

        .catch((err)=> {
            return res.status(500).send({message: 'Error en la peticion al servidor'});
        });
}

/**
 * Metodo para setear como leido un mensaje
 * @param {*} req 
 * @param {*} res 
 */
function setViewedMessages(req, res){
    var userID = req.user.sub;

    Message.update({receiver: userID, viewed: 'false'}, {viewed: 'true'}, {"multi": true}, (err,messagesUpdate) => {
        if(err) return res.status(500).send({message: 'Error en la peticion al servidor'});
        return res.status(200).send({messages: messagesUpdate});
    })
}

module.exports = {
    probando,
    saveMessage,
    getReceivedMessages,
    getEmittedMessages,
    unViewedMessages,
    setViewedMessages
}