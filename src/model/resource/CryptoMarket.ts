/// <reference path="./Hidden.ts" />

class CryptoMarket extends Hidden {
  public readonly resourceKey = ResourceKey.cryptoMarket;

  private _adjustmentTime = 0;

  constructor(config: GameConfig) {
    super(
      'crypto market',
      'crypto markets',
      'How much money a single FaithCoin is worth'
    );
    this.rawValue = config.cfgInitialCost.cryptoCurrency ?? 0;
  }

  public max = (state: GameState): number =>
    state.config.cfgInitialMax.cryptoMarket ?? 0;

  public advanceAction = (time: number, state: GameState): void => {
    const crypto = state.resource.cryptoCurrency;
    if (crypto === undefined) return;
    this._adjustmentTime += time;
    if (this._adjustmentTime >= state.config.cfgCryptoMarketAdjustPeriod) {
      this._adjustmentTime = 0;
      let adjustment =
        this.value *
          state.config.cfgCryptoMarketAdjustAmount *
          2 *
          Math.random() -
        this.value * state.config.cfgCryptoMarketAdjustAmount;
      adjustment +=
        this.value *
        state.config.cfgCryptoMarketAdjustAmount *
        Math.random() *
        state.config.cfgCryptoMarketGrowthBias;
      if (
        this.value + adjustment <
        state.config.cfgCryptoCurrencyMinimumValue
      ) {
        adjustment = state.config.cfgCryptoCurrencyMinimumValue - this.value;
      }
      //if (Math.abs(adjustment) > 0) {
      this.addValue(adjustment, state);
      state.log(
        `FaithCoin just ${
          adjustment > 0 ? 'increased' : 'decreased'
        } in value by $${formatNumber(Math.abs(adjustment))}.`
      );
      //}
      if (crypto?.cost !== undefined) {
        crypto.cost.money = this.value;
        state.autoAction(); // cause redraw
      }
    }
  };
}
