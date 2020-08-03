import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, DoCheck {

  public title:string;

  constructor() { 
    this.title = 'Mensajes Privados';
  }

  ngOnInit() {
    console.log('Componente Main cargado');
  }

  ngDoCheck(){
    
  }

}
