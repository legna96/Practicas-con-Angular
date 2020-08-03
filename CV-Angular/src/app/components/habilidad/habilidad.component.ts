import { Component, OnInit, Input } from '@angular/core';
import { Habilidad } from '../../models/habilidad';

@Component({
  selector: 'app-habilidad',
  templateUrl: './habilidad.component.html',
  styleUrls: ['./habilidad.component.css']
})
export class HabilidadComponent implements OnInit {

  @Input() habilidad: Habilidad[]

  constructor() { }

  ngOnInit() {
  }

}
