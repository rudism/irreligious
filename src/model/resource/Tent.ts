/// <reference path="./Infrastructure.ts" />

class Tent extends Infrastructure {
  constructor () {
    super('Tents',
      'Provides room to house 2 followers.');
    this.cost.money = 250;
    this._costMultiplier.money = 1.05;
  }

  public max: (state: GameState) => number = (state) => {
    // ten extra tents per compound
    let max: number = state.config.cfgStartingTentMax;
    max += state.getResource('cmpnd').value * 10;
    return max;
  };
}
