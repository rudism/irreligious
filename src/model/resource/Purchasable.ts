/// <reference path="./IResource.ts" />

abstract class Purchasable implements IResource {
  public readonly resourceType: ResourceType = ResourceType.Consumable;
  public valueInWholeNumbers = true;
  public clickText = 'Purchase';
  public clickDescription = 'Purchase';
  public value = 0;
  public readonly cost: { [key: string]: number } = { };

  protected _costMultiplier: { [key: string]: number } = { };
  protected _baseMax: number | null = null;
  protected _isUnlocked = false;

  constructor (
    public readonly name: string,
    public readonly description: string
  ) { }

  public max (state: GameState): number | null {
    return this._baseMax;
  }

  public inc (state: GameState): number | null {
    return null;
  }

  public clickAction (state: GameState): void {
    if (this.max(state) !== null && this.value >= this.max(state)) return;
    if (state.deductCost(this.cost)) {
      const amount: number = this._purchaseAmount(state);
      if (amount > 0) {
        this.value += amount;
        state.log(this._purchaseLog(amount, state));
        for (const rkey of Object.keys(this._costMultiplier)) {
          this.cost[rkey] *= this._costMultiplier[rkey];
        }
      }
    }
  }

  public addValue (amount: number, state: GameState): void {
    this.value += amount;
  }

  public isUnlocked (state: GameState): boolean {
    if (!this._isUnlocked && state.isPurchasable(this.cost)) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  }

  public advanceAction (time: number, state: GameState): void {
    return;
  }

  protected _purchaseAmount (state: GameState): number {
    return 1;
  }

  protected _purchaseLog (amount: number, state: GameState): string {
    return `You purchased ${amount} x ${this.name}.`;
  }
}
