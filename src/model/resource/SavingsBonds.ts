/// <reference path="./Purchasable.ts" />

class SavingsBonds extends Purchasable {
  public max?: number = null;
  private _isUnlocked = false;

  constructor (
    public value: number,
  ) {
    super('Savings Bonds', 'Grows money by a small amount over time.');
    this.cost = { 'money': 25 };
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

  protected purchaseEffect (state: GameState) {
    state.getResource('money').inc += 0.25;
  }
}
