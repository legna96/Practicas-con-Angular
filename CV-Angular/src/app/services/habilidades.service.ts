import { Injectable } from '@angular/core';
import { Habilidad } from '../models/habilidad';

@Injectable({
  providedIn: 'root'
})
export class HabilidadesService {

  private habilidades: Habilidad[] = [

      {
        // iconos: "fas fa-paint-brush",
        iconos: ["fab fa-angular angular-color","fab fa-sass sass-color", "fab fa-html5 html5-color"],
        titulo: "Web Fronted Jr",
        descripcion: `
        Creacion de sitios web, compatibilidad entre navegadores y dispositivos,
        uso de frameworks, peticiones HTTP al servidor web y lógica del lado del cliente
        `
      },
      {
        iconos: ["fab fa-java java-color","fab fa-node-js nodeJs-color","fab fa-python python-color"],
        titulo: "Web Backend Jr",
        descripcion: "he trabajado con herramientas backend como Spring (en Java), Codeigniter (en PHP), NodeJs (en Javascript)"
      },
      {
        iconos: ["fas fa-database database-color"],
        titulo: "DB",
        descripcion: "he trabajado con bases relacionales y no relacionales como MySQL, MongoDB, FireBase DataBase"
      },
      {
        iconos: ["fas fa-tv tv-color"],
        titulo: "Escritorio",
        descripcion: "he trabajado Apliaciones de Escritorio en lenguajes como Java y Python"
      },
      // {
      //   iconos: ["fab fa-android"],
      //   titulo: "Apps",
      //   descripcion: "he desarrollado Apliaciones Moviles en Ionic"
      // }
    ];

  constructor(){}

  dameHabilidades() {
    return this.habilidades;
  }

}
