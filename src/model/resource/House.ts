/// <reference path="./Infrastructure.ts" />

class House extends Infrastructure {
  constructor () {
    super('Houses',
      'Provides room to house 10 followers.');
    this.cost.money = 150000;
    this._baseMax = 0;
    this._costMultiplier.money = 1.1;
  }

  public max (state: GameState): number {
    let max: number = this._baseMax;
    max += state.getResource('cmpnd').value * 2;
    return max;
  }

  public isUnlocked (state: GameState): boolean {
    if (this._isUnlocked) return true;
    const tents: IResource = state.getResource('tents');
    if (tents.value === tents.max(state)) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  }
}
