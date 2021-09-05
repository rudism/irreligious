/// <reference path="./IResource.ts" />

class Religion implements IResource {
  public readonly resourceType: ResourceType = ResourceType.religion;
  public readonly valueInWholeNumbers: boolean = true;
  public readonly clickText: null = null;
  public readonly clickDescription: null = null;
  public readonly cost: null = null;

  public readonly max: null = null;
  public readonly inc: null = null;
  public readonly clickAction: null = null;
  public readonly advanceAction: null = null;

  constructor (
    public readonly name: string,
    public readonly description: string,
    public value: number,
  ) { }

  public addValue (amount: number, _state: GameState): void {
    this.value += amount;
  }

  public isUnlocked (_state: GameState): boolean {
    return true;
  }
}
