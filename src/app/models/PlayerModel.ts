import { ColorModel } from 'app/models';

export interface PlayerModel {
  id?: number;
  squaresSequences: PlayerModel.sequence[];
  maxSequenceLength: number;
  color: ColorModel;
  name: string;
}

export namespace PlayerModel {
  export type sequence =  {[key:string]: boolean};
}
