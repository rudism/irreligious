/// <reference path="./Infrastructure.ts" />

class Church extends Infrastructure {
  constructor () {
    super('Churches',
      'Preaching grounds for 2 pastors.');
    this.cost.money = 150000;
    this._costMultiplier.money = 1.01;
  }

  public max: (state: GameState) => number = (state) =>
    state.getResource('cmpnd').value;

  public isUnlocked (state: GameState): boolean {
    if (this._isUnlocked) return true;
    const compounds = state.getResource('cmpnd');
    if (compounds.value > 0) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  }
}
