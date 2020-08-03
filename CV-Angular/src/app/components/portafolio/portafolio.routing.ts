import { Routes } from '@angular/router';
import { TrabajoComponent } from '../trabajo/trabajo.component';
import { GithubComponent } from '../github/github.component';


const routes: Routes = [
  { path: 'Trabajos', component: TrabajoComponent },
  { path: 'GitHub', component: GithubComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'Trabajos' }
];

export const RUTAS_PORTAFOLIO = routes;
