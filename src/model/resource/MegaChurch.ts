/// <reference path="./Infrastructure.ts" />

class MegaChurch extends Infrastructure {
  constructor () {
    super('MegaChurches',
      'Room for 5 pastors');
    this.cost.money = 7500000;
    this._costMultiplier.money = 1.01;
    this._baseMax = 2;
  }

  public isUnlocked (state: GameState): boolean {
    if (this._isUnlocked) return true;
    const permit: IResource = state.getResource('blpmt');
    if (permit.value > 0) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  }
}
