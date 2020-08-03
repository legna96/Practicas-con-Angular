import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nieto',
  templateUrl: './nieto.component.html',
  styleUrls: ['./nieto.component.css']
})
export class NietoComponent {

  @Input("contador")
  contador: number;

  @Output()
  cambioContador = new EventEmitter<number>();

  constructor() { }

  reset() {
    this.contador = 0;
    this.cambioContador.emit(this.contador);
  }

}
