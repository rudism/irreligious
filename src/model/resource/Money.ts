/// <reference path="./Purchasable.ts" />

class Money extends Purchasable {
  public readonly resourceType = ResourceType.consumable;

  private _lastCollectionTime = 0;

  constructor (
    public value: number
  ) {
    super('Money', 'Used to purchase goods and services.');
    this.clickText = 'Collect Tithes';
    this.clickDescription = 'Voluntary contributions from followers.';
    this.valueInWholeNumbers = false;
    this._isUnlocked = true;
  }

  public max: (state: GameState) => number = (state: GameState) => {
    let max = state.config.cfgInitialMax.money ?? 0;
    max += (state.resource.compounds?.value ?? 0)
      * (state.config.cfgCapacity.compounds?.money ?? 0);
    return max;
  };

  public inc: (state: GameState) => number = (state) => {
    let inc = 0;

    // crypto currency
    inc += (state.resource.cryptoCurrency?.value ?? 0)
      * state.config.cfgCryptoReturnAmount;

    // salaries
    inc -= (state.resource.pastors?.value ?? 0)
      * (state.config.cfgSalary.pastors ?? 0);

    return inc;
  };

  protected _purchaseAmount (state: GameState): number {
    const plorg = state.resource.playerOrg;
    if (plorg === undefined || plorg.value === 0) {
      state.log('You have no followers to collect from!');
      return 0;
    }
    const diff = state.now - this._lastCollectionTime;
    if (diff < state.config.cfgTimeBetweenTithes) {
      const lost = state.config.cfgTimeBetweenTithes / diff / 3;
      state.resource.credibility?.addValue(lost * -1, state);
    }
    const tithings = plorg.value * state.config.cfgTitheAmount;
    this._lastCollectionTime = state.now;
    return tithings;
  }

  protected _purchaseLog (amount: number, state: GameState): string {
    const followers = state.resource.playerOrg?.value ?? 0;
    return `You collected $${state.config.formatNumber(amount)} from ${state.config.formatNumber(followers)} followers.`;
  }
}
