import { Action } from '@ngrx/store'

export const INCREMENTAR = "[CONTADOR] INCREMENTAR"
export const DECREMENTAR = "[CONTADOR] DECREMENTAR"

export class IncrementarAction implements Action {

  readonly type = INCREMENTAR;
}

export class DecrementarAction implements Action {
  readonly type = DECREMENTAR;
}
