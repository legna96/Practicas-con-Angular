import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Rutas
import { APP_ROUTES } from './app.routing';

// Componentes
import { AppComponent } from './app.component';
import { MenuComponent } from './components/shared/menu/menu.component';
import { PortafolioComponent } from './components/portafolio/portafolio.component';
import { AcercaDeMiComponent } from './components/acerca-de-mi/acerca-de-mi.component';
import { GithubComponent } from './components/github/github.component';
import { ContactoComponent } from './components/contacto/contacto.component';

// Modulos
import { HttpClientModule } from '@angular/common/http';
import { ResumenComponent } from './components/resumen/resumen.component';
import { TrabajoComponent } from './components/trabajo/trabajo.component';
import { HabilidadComponent } from './components/habilidad/habilidad.component';
import { FooterComponent } from './components/shared/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    PortafolioComponent,
    AcercaDeMiComponent,
    GithubComponent,
    ContactoComponent,
    ResumenComponent,
    TrabajoComponent,
    HabilidadComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
