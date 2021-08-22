/// <reference path="./Purchasable.ts" />

class Money extends Purchasable {
  private _lastCollectionTime: number = 0;

  public resourceType: ResourceType = ResourceType.Consumable;
  public cost: { [key: string]: number } = { };
  public readonly valueInWholeNumbers: boolean = false;

  constructor (
    public value: number
  ) {
    super('Money', 'Used to purchase goods and services.');
    this.clickText = 'Collect Tithes';
    this.clickDescription = 'Voluntary contributions from followers.';
    this._baseMax = 500000;
  }

  public isUnlocked (state: GameState): boolean {
    return true;
  }

  public inc (state: GameState): number {
    let inc: number = 0;

    // crypto currency
    inc += state.getResource('crpto').value
      * state.config.cfgCryptoReturnAmount;

    return inc;
  }

  protected _purchaseAmount (state: GameState): number {
    const plorg: IResource = state.getResource('plorg');
    if (plorg.value === 0) {
      state.log('You have no followers to collect from!');
      return 0;
    }
    const diff: number = state.now - this._lastCollectionTime;
    if (diff < state.config.cfgTimeBetweenTithes) {
      const lost: number = state.config.cfgTimeBetweenTithes / diff / 3;
      state.getResource('creds').value -= lost;
    }
    // each follower gives you $10
    const tithings: number = plorg.value * state.config.cfgTitheAmount;
    this._lastCollectionTime = state.now;
    return tithings;
  }

  protected _purchaseLog (amount: number, state: GameState): string {
    const followers: number = state.getResource('plorg').value;
    return `You collected $${state.formatNumber(amount)} from ${state.formatNumber(followers)} followers.`;
  }

  public max (state: GameState): number | null {
    let max: number = this._baseMax;
    max += state.getResource('cmpnd').value * 500000;
    return max;
  }
}
