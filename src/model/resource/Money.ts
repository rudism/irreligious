/// <reference path="./Purchasable.ts" />

class Money extends Purchasable {
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
    // each follower gives you $10
    const tithings: number = plorg.value * 10;
    state.log(`You collected $${state.formatNumber(tithings)} from ${state.formatNumber(plorg.value)} followers.`);
    return tithings;
  }
}
