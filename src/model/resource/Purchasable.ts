/// <reference path="./IResource.ts" />

abstract class Purchasable implements IResource {
  public readonly resourceType = ResourceType.Infrastructure;
  public readonly max?: number = null;
  public value: number = 0;

  public clickText: string = 'Purchase';
  public clickDescription: string = 'Purchase';

  public cost: { [key: string]: number } = null;
  protected _costMultiplier: { [key: string]: number } = null;

  constructor (
    public readonly name: string,
    public readonly description: string
  ) { }

  public clickAction (state: GameState) {
    if (this.max !== null && this.value >= this.max) return;
    if (state.deductCost(this.cost)) {
      this.value += 1;
      if (this._costMultiplier !== null
        && Object.keys(this._costMultiplier !== null)) {
        for (const rkey of Object.keys(this._costMultiplier)) {
          this.cost[rkey] *= this._costMultiplier[rkey];
        }
      }
    }
  }

  public advanceAction (time: number, state: GameState): void {
    return;
  }

  public isUnlocked (state: GameState): boolean {
    return false;
  }
}
