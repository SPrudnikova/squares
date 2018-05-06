import { PlayerModel, FieldCellModel } from 'app/models';

export interface GameModel {
  players: PlayerModel[];
  field: GameModel.field;
  fieldSize: number;
  activePlayer: PlayerModel | null;
  winner: PlayerModel | null;
  isFinished: boolean
}

export namespace GameModel {
  export type field =  {[key:string]: FieldCellModel};
}
