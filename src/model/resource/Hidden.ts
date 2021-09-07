/// <reference path="./IResource.ts" />

abstract class Hidden implements IResource {
  public readonly resourceType = ResourceType.passive;
  public readonly valueInWholeNumbers = false;
  public value = 0;

  constructor(
    public readonly singularName: string,
    public readonly pluralName: string,
    public readonly description: string
  ) {}

  public addValue(amount: number, _state: GameState): void {
    this.value += amount;
  }

  public isUnlocked(_state: GameState): boolean {
    return true;
  }
}
