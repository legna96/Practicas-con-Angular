'use strict'

//modulos
var express = require('express');
var api = express.Router();

//middlewares
var md_auth = require('../middlewares/authenticated');

//controladores
var MessageController = require('../controllers/message');

api.get('/probando-md', md_auth.ensureAuth, MessageController.probando);
api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/my-messages/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/messages/:page?', md_auth.ensureAuth, MessageController.getEmittedMessages);
api.get('/unviewed-messages', md_auth.ensureAuth, MessageController.unViewedMessages);
api.get('/setviewed-messages', md_auth.ensureAuth, MessageController.setViewedMessages);

module.exports = api;