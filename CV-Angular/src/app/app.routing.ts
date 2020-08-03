import { Routes, RouterModule } from '@angular/router';
import { AcercaDeMiComponent } from './components/acerca-de-mi/acerca-de-mi.component';
import { PortafolioComponent } from './components/portafolio/portafolio.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { ResumenComponent } from './components/resumen/resumen.component';
import { RUTAS_PORTAFOLIO } from './components/portafolio/portafolio.routing';


const RUTAS: Routes = [
  { path: 'Acerca-de-Mi', component: AcercaDeMiComponent },
  { path: 'Resumen', component: ResumenComponent },
  {
    path: 'Portafolio',
    component: PortafolioComponent,
    children: RUTAS_PORTAFOLIO
  },
  { path: 'Contacto', component: ContactoComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'Acerca-de-Mi' }
];

export const APP_ROUTES = RouterModule.forRoot(RUTAS, {useHash: true});
