/// <reference path="./Infrastructure.ts" />

class Tent extends Infrastructure {
  constructor () {
    super('Tents',
      'Provides room to house 2 followers.');
    this.cost.money = 250;
    this._costMultiplier.money = 1.1;
    this._baseMax = 5;
  }

  public max (state: GameState): number {
    let max: number = this._baseMax;
    max += state.getResource('cmpnd').value * 10;
    return max;
  }
}
