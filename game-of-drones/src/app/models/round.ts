export class RoundModel {
  public id: number;
  public winnerName: string;
  public roundNumber: number;
  public movesCount: number;
  public matchId: number;

  constructor(obj: any = null) {
    if (obj !== null) {
      Object.assign(this, obj);
    } else {
      obj = {roundNumber: 1, movesCount: 0};
      Object.assign(this, obj);
    }
  }
}
