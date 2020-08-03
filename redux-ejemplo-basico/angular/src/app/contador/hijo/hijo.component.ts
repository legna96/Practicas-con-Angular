import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-hijo',
  templateUrl: './hijo.component.html',
  styleUrls: ['./hijo.component.css']
})
export class HijoComponent {

  @Input("contador")
  contador: number

  @Output() cambioContador = new EventEmitter<number>();

  constructor() { }

  multiplicar() {
    this.contador *= 5;
    this.cambioContador.emit(this.contador);
  }

  dividir() {
    this.contador /= 5;
    this.cambioContador.emit(this.contador);
  }

  reset(event) {
    this.contador = event;
    this.cambioContador.emit(this.contador);
  }

}
