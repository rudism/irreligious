/// <reference path="./Purchasable.ts" />

class Money extends Purchasable {
  constructor (
    public value: number,
  ) {
    super('Money', 'Used to purchase goods and services.');
    this.clickText = 'Beg';
    this.clickDescription = 'Alms for the poor.';
    this._baseMax = 1000;
  }

  public isUnlocked (state: GameState): boolean {
    return true;
  }

  public inc (state: GameState): number {
    let baseInc: number = 0;
    // bonds give $1/s
    baseInc += state.getResource('bonds').value;
    return baseInc;
  }
}
