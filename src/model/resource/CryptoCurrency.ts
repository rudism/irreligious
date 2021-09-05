/// <reference path="./Purchasable.ts" />

class CryptoCurrency extends Purchasable {
  constructor (config: GameConfig) {
    super('Faithcoin',
      "A crypto coin that can't be spent directly, but provides a steady stream of passive income.");
    this.cost.money = config.cfgCryptoStartingCost;
    this._costMultiplier.money = config.cfgCryptoCostMultiplier;
    this.valueInWholeNumbers = false;
  }

  public max: (state: GameState) => number = (state) =>
    state.config.cfgCryptoStartingMax;
}
