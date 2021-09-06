/// <reference path="./IResource.ts" />

class Religion implements IResource {
  public readonly resourceType = ResourceType.religion;
  public readonly valueInWholeNumbers = true;

  constructor (
    public readonly singularName: string,
    public readonly pluralName: string,
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
