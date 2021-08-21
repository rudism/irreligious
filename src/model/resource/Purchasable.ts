/// <reference path="./IResource.ts" />

abstract class Purchasable implements IResource {
  public readonly resourceType = ResourceType.Infrastructure;
  public readonly max?: number = null;
  public value: number = 0;
  public unlocked: boolean = false;

  public clickText: string = "Purchase";
  public clickDescription: string = null;

  constructor (
    public readonly name: string,
    public readonly description: string,
    private _cost: { [key: string]: number }
  ) { }

  public clickAction (state: GameState) {
    if (this.max !== null && this.value >= this.max) return;
    if (state.deductCost(this._cost)) {
      this.value += 1;
    }
  }

  public advanceAction (time: number, state: GameState) {
    // do nothing
  }
}
