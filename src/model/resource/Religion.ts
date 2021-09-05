/// <reference path="./IResource.ts" />

class Religion implements IResource {
  public readonly resourceType = ResourceType.religion;
  public readonly valueInWholeNumbers = true;
  public readonly clickText = null;
  public readonly clickDescription = null;
  public readonly cost = null;

  public readonly max = null;
  public readonly inc = null;
  public readonly clickAction = null;
  public readonly advanceAction = null;

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
