import { Injectable } from '@angular/core';
import { Trabajo } from '../models/trabajo';

@Injectable({
  providedIn: 'root'
})

export class TrabajoService {

  private trabajos:Trabajo[] = [
    {
      img: "assets/img/portafolio/crud-heroes.jpg",
      titulo: "Crud de Heroes",
      fecha: "9 de septiembre de 2018",
      tecnologias: ["Angular", "Firebase"]
    },
    {
      img: "assets/img/portafolio/crud-empleados.jpg",
      titulo: "Crud de Empleados",
      fecha: "12 de septiembre de 2019",
      tecnologias: ["MongoDB", "Express", "Angular", "Nodejs"]
    }
  ]

  constructor() {}

  getTrabajos(){
    return this.trabajos;
  }
}
