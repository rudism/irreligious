/// <reference path="./Purchasable.ts" />

class CryptoCurrency extends Purchasable {
  constructor () {
    super('Faithcoin',
      "A crypto coin that can't be spent directly, but provides a steady stream of passive income.");
    this.cost.money = 100;
    this._costMultiplier.money = 1.1;
    this._baseMax = 1000;
    this.valueInWholeNumbers = false;
  }
}
