/// <reference path="./IResource.ts" />

abstract class Hidden implements IResource {
  public readonly resourceType: ResourceType = ResourceType.Hidden;
  public readonly clickText: null = null;
  public readonly clickDescription: null = null;
  public readonly advanceAction: null = null;
  public readonly cost: null = null;
  public readonly clickAction: null = null;
  public readonly name: null = null;
  public readonly description: null = null;

  protected _baseMax: number | null = null;

  constructor (
    public value: number
  ) { }

  public inc (state: GameState): number | null {
    return null;
  }

  public max (state: GameState): number | null {
    return this._baseMax;
  }

  public isUnlocked (state: GameState): boolean {
    return true;
  }
}
