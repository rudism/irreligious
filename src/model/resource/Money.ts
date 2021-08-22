/// <reference path="./Purchasable.ts" />

class Money extends Purchasable {
  private _lastCollectionTime: number = 0;

  public resourceType: ResourceType = ResourceType.Consumable;
  public cost: { [key: string]: number } = { };

  constructor (
    public value: number,
  ) {
    super('Money', 'Used to purchase goods and services.');
    this.clickText = 'Collect Tithes';
    this.clickDescription = 'Voluntary contributions from followers.';
    this._baseMax = 999999;
  }

  public isUnlocked (state: GameState): boolean {
    return true;
  }

  public inc (state: GameState): number {
    // crypto currency
    return state.getResource('crpto').value * 0.5;
  }

  protected _purchaseAmount (state: GameState): number {
    const plorg: IResource = state.getResource('plorg');
    if (plorg.value === 0) {
      state.log('You have no followers to collect from!');
      return 0;
    }
    const diff: number = state.now - this._lastCollectionTime;
    if (diff < 30000) {
      const lost: number = 30000 / diff / 3;
      state.getResource('creds').value -= lost;
    }
    // each follower gives you $10
    const tithings: number = plorg.value * 10;
    state.log(`You collected $${state.formatNumber(tithings)} from ${state.formatNumber(plorg.value)} followers.`);
    this._lastCollectionTime = state.now;
    return tithings;
  }
}
