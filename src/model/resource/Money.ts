/// <reference path="./Purchasable.ts" />

class Money extends Purchasable {
  private _lastCollectionTime: number = 0;

  public cost: { [key: string]: number } = { };

  constructor (
    public value: number,
  ) {
    super('Money', 'Used to purchase goods and services.');
    this.clickText = 'Collect Tithes';
    this.clickDescription = 'Voluntary contributions from followers.';
  }

  public isUnlocked (state: GameState): boolean {
    return true;
  }

  protected _incrementAmount (state: GameState): number {
    const plorg: IResource = state.getResource('plorg');
    if (plorg.value === 0) {
      state.log('You have no followers to collect from!');
      return 0;
    }
    if (state.now - this._lastCollectionTime < 30000) {
      this.cost.creds = 0.05;
      state.deductCost(this.cost);
      delete this.cost.creds;
    }
    // each follower gives you $10
    const tithings: number = plorg.value * 10;
    state.log(`You collected $${state.formatNumber(tithings)} from ${state.formatNumber(plorg.value)} followers.`);
    this._lastCollectionTime = state.now;
    return tithings;
  }
}
