/// <reference path="./Infrastructure.ts" />

class Compound extends Infrastructure {
  constructor () {
    super('Compounds',
      'Provides space for tents, houses, and churches and a place to hide more money.');
    this.cost.money = 15000;
    this._costMultiplier.money = 1.5;
  }

  public isUnlocked (state: GameState): boolean {
    if (this._isUnlocked) return true;
    const tents: IResource = state.getResource('tents');
    if (tents.value >= 5) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  }
}
