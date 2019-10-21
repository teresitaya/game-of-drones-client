export class MoveModel {

  public move: string;
  public player: string;
  public moveNumber: number;
  public id: number;
  public matchId: number;
  public roundId: number;

  constructor(obj: any = null) {
     if (obj !== null) {
      obj = Object.assign(this, obj);
    }
  }
}
