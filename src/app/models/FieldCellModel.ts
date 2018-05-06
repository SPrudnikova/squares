import { PlayerModel } from 'app/models';

export interface FieldCellModel {
  player: PlayerModel | null;
  coords: string;
}
