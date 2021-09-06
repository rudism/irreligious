/// <reference path="./IResource.ts" />

abstract class Purchasable implements IResource {
  public readonly resourceType: ResourceType = ResourceType.consumable;
  public valueInWholeNumbers = true;
  public clickText = 'Purchase';
  public clickDescription = 'Purchase';
  public value = 0;
  public readonly cost: ResourceNumber = { };

  public inc?: (state: GameState) => number = undefined;
  public max?: (_state: GameState) => number = undefined;

  protected _costMultiplier: ResourceNumber = { };
  protected _isUnlocked = false;

  constructor (
    public readonly name: string,
    public readonly description: string
  ) { }


  public clickAction (state: GameState): void {
    if (this.max !== undefined && this.value >= this.max(state)) return;
    if (state.deductCost(this.cost)) {
      const amount = this._purchaseAmount(state);
      if (amount > 0) {
        this.value += amount;
        state.log(this._purchaseLog(amount, state));
        for (const key in this._costMultiplier) {
          const rkey = <ResourceKey>key;
          this.cost[rkey] =
            (this.cost[rkey] ?? 0) * (this._costMultiplier[rkey] ?? 1);
        }
      }
    }
  }

  public addValue (amount: number, _state: GameState): void {
    this.value += amount;
  }

  public isUnlocked (state: GameState): boolean {
    if (!this._isUnlocked && state.isPurchasable(this.cost)) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  }

  public advanceAction (_time: number, _state: GameState): void {
    return;
  }

  protected _purchaseAmount (_state: GameState): number {
    return 1;
  }

  protected _purchaseLog (amount: number, _state: GameState): string {
    return `You purchased ${amount} x ${this.name}.`;
  }
}
