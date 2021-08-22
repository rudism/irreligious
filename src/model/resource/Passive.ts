/// <reference path="./IResource.ts" />

abstract class Passive implements IResource {
  public readonly resourceType: ResourceType = ResourceType.Passive;
  public readonly clickText: null = null;
  public readonly clickDescription: null = null;
  public readonly cost: null = null;
  public readonly clickAction: null = null;
  public readonly valueInWholeNumbers: boolean = false;

  protected _baseMax: number | null;
  protected _baseInc: number | null;

  constructor (
    public name: string,
    public description: string,
    public value: number,
    max: number | null,
    inc: number | null
  ) {
    this._baseMax = max;
    this._baseInc = inc;
  }

  public inc (state: GameState): number | null {
    return this._baseInc;
  }

  public max (state: GameState): number | null {
    return this._baseMax;
  }

  public isUnlocked (state: GameState): boolean {
    return true;
  }

  public advanceAction (time: number, state: GameState): void {
    return;
  }
}
