'use strict'

//modulos
var express = require('express');
var api = express.Router();
var multipart = require('connect-multiparty');
//middlewares
var md_auth = require('../middlewares/authenticated');
var md_upload = multipart({uploadDir: './uploads/publications'})
//controladores
var PublicationController = require('../controllers/publication');

api.get('/probando-pub', md_auth.ensureAuth, PublicationController.probando);
api.post('/publication', md_auth.ensureAuth, PublicationController.savePublication);
api.get('/publications/:page?', md_auth.ensureAuth, PublicationController.getPublications);
api.get('/publications-user/:user/:page?', md_auth.ensureAuth, PublicationController.getPublicationsUser);
api.get('/publication/:id', md_auth.ensureAuth, PublicationController.getPublication);
api.delete('/publications/:id', md_auth.ensureAuth, PublicationController.deletePublication);
api.post('/upload-image-pub/:id', [md_auth.ensureAuth, md_upload], PublicationController.uploadImage);
api.get('/get-image-pub/:imageFile', PublicationController.getImageFile);

module.exports = api;