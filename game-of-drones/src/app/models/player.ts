export class PlayerModel {
  public id: number;

  public playerName: string;

  constructor(obj: any = null) {
    if (obj != null) {
      Object.assign(this, obj);
    }
  }
}
