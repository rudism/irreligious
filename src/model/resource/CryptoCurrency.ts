/// <reference path="./Purchasable.ts" />

class CryptoCurrency extends Purchasable {
  public readonly resourceKey = ResourceKey.cryptoCurrency;

  constructor() {
    super(
      'FaithCoin',
      'faithcoin',
      'faithcoins',
      "A crypto coin that can't be spent directly, but provides a steady stream of passive income.",
      true
    );
    this.valueInWholeNumbers = false;
  }

  public cost = (state: GameState): ResourceNumber => {
    const cost: ResourceNumber = {};
    const market = state.resource.cryptoMarket;
    if (market !== undefined) {
      cost.money = market.value;
    } else {
      cost.money = state.config.cfgInitialCost.cryptoCurrency;
    }
    return cost;
  };

  public isUnlocked = (): boolean => true;

  public max = (state: GameState): number =>
    state.config.cfgInitialMax.cryptoCurrency ?? 0;
}
