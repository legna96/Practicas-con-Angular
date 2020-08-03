import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { IncrementarAction, DecrementarAction } from '../contador.actions';

interface AppState { contador: number; }

@Component({
  selector: 'app-padre',
  templateUrl: './padre.component.html',
  styleUrls: ['./padre.component.css']
})
export class PadreComponent {

  contador : number;

  constructor(private store: Store<AppState>) {
    this.store.subscribe( state => {
      // console.log(state);
      this.contador = state.contador
    })
  }
  aumentar() {

    const action =  new IncrementarAction();
    this.store.dispatch(action);

  }

  decrementar() {
    const action =  new DecrementarAction();
    this.store.dispatch(action);
  }

}
