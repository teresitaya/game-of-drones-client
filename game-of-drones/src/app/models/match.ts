import { PlayerModel } from './player';
import { RoundModel } from './round';

export class MatchModel {
  public id: number;
  public player1: PlayerModel;
  public player2: PlayerModel;
  public winner: any;
  public rounds: RoundModel[];

  constructor(obj: any = null) {
    if (obj !== null) {
      Object.assign(this, obj);
    }
  }
}
