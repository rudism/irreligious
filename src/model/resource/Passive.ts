/// <reference path="./IResource.ts" />

abstract class Passive implements IResource {
  public readonly resourceType = ResourceType.passive;
  public readonly valueInWholeNumbers = false;
  public value = 0;

  public advanceAction?: (time: number, state: GameState) => void = undefined;

  constructor(
    public readonly label: string,
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
