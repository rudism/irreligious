/// <reference path="./Purchasable.ts" />

class Savings extends Purchasable {
  private _isUnlocked: boolean = false;

  constructor (
    public value: number,
  ) {
    super('Savings', "Can't be spent, but grows money over time.");
    this.cost = { 'money': 10 };
    this._costMultiplier = { 'money': 1.1 };
  }

  public isUnlocked (state: GameState): boolean {
    if (this._isUnlocked) return true;
    if (state.getResource('money').value >= this.cost.money) {
      this._isUnlocked = true;
      return true;
    }
    return false;
  }

  protected purchaseEffect (state: GameState): void {
    return;
  }
}
