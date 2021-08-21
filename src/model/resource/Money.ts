/// <reference path="./Purchasable.ts" />

class Money extends Purchasable {
  constructor (
    public value: number,
    public max: number
  ) {
    super('Money', 'Used to purchase goods and services.');
    this.clickText = 'Beg';
    this.clickDescription = 'Alms for the poor.';
  }

  public isUnlocked (state: GameState): boolean {
    return true;
  }
}
