import {Action} from '@ngrx/store'
import { INCREMENTAR, DECREMENTAR } from './contador.actions';

export function contadorReducer(state:number = 8, action: Action) {
  switch (action.type) {

    case INCREMENTAR:
      return state + 1;

    case DECREMENTAR:
      return state - 1;

    default:
      return state;
  }
}
