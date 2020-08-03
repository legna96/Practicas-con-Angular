'use strict'
var mongoose = require('mongoose');
var app = require('./app');

app.set('port', process.env.PORT || 3000);

mongoose.connect("mongodb://localhost:27017/Curso-Mean-Social", { useNewUrlParser: true })
    .then(() => {
        console.log('Conexion a la DB "Curso_Mean_Social" se ha realizado correctamente');
        //crear Servidor
        app.listen(app.get('port'), () => {
            console.log('Servidor Corriendo en Puerto ' + app.get('port'));
        });
    })
    .catch(err => console.log(err));



