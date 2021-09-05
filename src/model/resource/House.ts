/// <reference path="./Infrastructure.ts" />

class House extends Infrastructure {
  constructor () {
    super('Houses',
      'Provides room to house 10 followers.');
    this.cost.money = 75000;
    this._costMultiplier.money = 1.01;
  }

  // two houses per compound
  public max: (state: GameState) => number = (state) =>
    state.getResource('cmpnd').value * 2;

  public isUnlocked (state: GameState): boolean {
    if (this._isUnlocked) return true;
    const compounds = state.getResource('cmpnd');
    if (compounds.value > 0) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  }
}
