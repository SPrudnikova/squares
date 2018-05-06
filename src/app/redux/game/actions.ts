import { createAction } from 'redux-actions';
import { FieldCellModel, PlayerModel } from 'app/models';


export interface StartGameSettings {
  players: PlayerModel[];
  fieldSize: number;
}

export namespace GameActions {
  export enum Type {
    START_GAME = 'START_GAME',
    PLAYER_MOVE = 'PLAYER_MOVE',
    RESTART_GAME = 'RESTART_GAME',
  }

  export const startGame = createAction<StartGameSettings>(Type.START_GAME);
  export const playerMove = createAction<FieldCellModel>(Type.PLAYER_MOVE);
  export const restartGame = createAction(Type.RESTART_GAME);
}

export type GameActions = Omit<typeof GameActions, 'Type'>;
