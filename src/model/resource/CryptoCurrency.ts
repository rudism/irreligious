/// <reference path="./Purchasable.ts" />

class CryptoCurrency extends Purchasable {
  constructor (config: GameConfig) {
    super(
      'FaithCoin',
      'faithcoin',
      'faithcoins',
      "A crypto coin that can't be spent directly, but provides a steady stream of passive income.");
    this.cost.money = config.cfgInitialCost.cryptoCurrency;
    this._costMultiplier.money = config.cfgCostMultiplier.cryptoCurrency;
    this.valueInWholeNumbers = false;
  }

  public max: (state: GameState) => number = (state) =>
    state.config.cfgInitialMax.cryptoCurrency ?? 0;
}
