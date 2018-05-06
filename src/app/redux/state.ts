import { GameModel } from 'app/models';
import { RouterState } from 'react-router-redux';

export interface RootState {
  game: RootState.GameState,
  router: RouterState;
}

export namespace RootState {
  export type GameState = GameModel;
}
