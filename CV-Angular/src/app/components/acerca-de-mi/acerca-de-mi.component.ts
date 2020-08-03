import { Component, OnInit } from '@angular/core';
import { Habilidad } from '../../models/habilidad';
import { HabilidadesService } from '../../services/habilidades.service';

@Component({
  selector: 'app-acerca-de-mi',
  templateUrl: './acerca-de-mi.component.html',
  styleUrls: ['./acerca-de-mi.component.css']
})
export class AcercaDeMiComponent implements OnInit {

  public habilidades: Habilidad[] = [];

  constructor(private habilidadesService: HabilidadesService) {

  }

  ngOnInit() {
    this.dameHabilidades();
  }

  dameHabilidades(){
    this.habilidades = this.habilidadesService.dameHabilidades();
  }

}
