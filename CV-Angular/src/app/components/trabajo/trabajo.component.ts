import { Component, OnInit } from '@angular/core';
import { TrabajoService } from '../../services/trabajos.service';
import { Trabajo } from 'src/app/models/trabajo';

@Component({
  selector: 'app-trabajo',
  templateUrl: './trabajo.component.html',
  styleUrls: ['./trabajo.component.css']
})
export class TrabajoComponent implements OnInit {

  public trabajos: Trabajo[];

  constructor(
    private trabajoService: TrabajoService
  ) { }

  ngOnInit() {
    this.getTrabajos();
    console.log(this.trabajos);

  }

  getTrabajos(){
    this.trabajos = this.trabajoService.getTrabajos()

  }

}
