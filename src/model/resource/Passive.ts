/// <reference path="./IResource.ts" />

abstract class Passive implements IResource {
  public readonly resourceType: ResourceType = ResourceType.Passive;
  public readonly valueInWholeNumbers: boolean = false;
  public readonly clickText: null = null;
  public readonly clickDescription: null = null;
  public value = 0;
  public readonly cost: null = null;

  public readonly clickAction: null = null;

  protected _baseMax: number | null;
  protected _baseInc: number | null;

  constructor (
    public readonly name: string,
    public readonly description: string
  ) { }

  public max (state: GameState): number | null {
    return this._baseMax;
  }

  public inc (state: GameState): number | null {
    return this._baseInc;
  }

  public addValue (amount: number, state: GameState): void {
    this.value += amount;
  }

  public isUnlocked (state: GameState): boolean {
    return true;
  }

  public advanceAction (time: number, state: GameState): void {
    return;
  }
}
