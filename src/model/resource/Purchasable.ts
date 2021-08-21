/// <reference path="./IResource.ts" />

abstract class Purchasable implements IResource {
  public readonly resourceType: ResourceType = ResourceType.Infrastructure;
  public value: number = 0;

  public clickText: string = 'Purchase';
  public clickDescription: string = 'Purchase';

  public cost: { [key: string]: number } | null = null;

  protected _costMultiplier: { [key: string]: number } | null = null;
  protected _baseMax: number | null = null;

  constructor (
    public readonly name: string,
    public readonly description: string
  ) { }

  public clickAction (state: GameState): void {
    if (this.max(state) !== null && this.value >= this.max(state)) return;
    if (state.deductCost(this.cost)) {
      this.value += this._incrementAmount(state);
      if (this._costMultiplier !== null
        && Object.keys(this._costMultiplier !== null)) {
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
    return false;
  }

  protected _incrementAmount (state: GameState): number {
    return 1;
  }
}
