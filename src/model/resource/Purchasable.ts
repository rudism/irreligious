/// <reference path="./IResource.ts" />

abstract class Purchasable implements IResource {
  public readonly resourceType: ResourceType = ResourceType.Consumable;
  public value: number = 0;
  public valueInWholeNumbers: boolean = true;

  public clickText: string = 'Purchase';
  public clickDescription: string = 'Purchase';

  public cost: { [key: string]: number } = { };

  protected _costMultiplier: { [key: string]: number } = { };
  protected _baseMax: number | null = null;
  protected _isUnlocked: boolean = false;

  constructor (
    public readonly name: string,
    public readonly description: string
  ) { }

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

  public inc (state: GameState): number | null {
    return null;
  }

  public max (state: GameState): number | null {
    return this._baseMax;
  }

  public advanceAction (time: number, state: GameState): void {
    return;
  }

  public isUnlocked (state: GameState): boolean {
    if (!this._isUnlocked && state.isPurchasable(this.cost)) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  }

  protected _purchaseAmount (state: GameState): number {
    return 1;
  }

  protected _purchaseLog (amount: number, state: GameState): string {
    return `You purchased ${amount} x ${this.name}.`;
  }
}
