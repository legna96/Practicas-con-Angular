import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import { contadorReducer } from './contador/contador.reducer';

import { AppComponent } from './app.component';
import { PadreComponent } from './contador/padre/padre.component';
import { HijoComponent } from './contador/hijo/hijo.component';
import { NietoComponent } from './contador/nieto/nieto.component';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    PadreComponent,
    HijoComponent,
    NietoComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({contador: contadorReducer}),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
