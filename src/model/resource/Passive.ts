/// <reference path="./IResource.ts" />

abstract class Passive implements IResource {
  public readonly resourceType = ResourceType.passive;
  public readonly valueInWholeNumbers = false;
  public readonly clickText = null;
  public readonly clickDescription = null;
  public value = 0;
  public readonly cost = null;

  public readonly clickAction = null;

  public max: ((state: GameState) => number) | null = null;
  public inc: ((state: GameState) => number) | null = null;
  public advanceAction: (
    (time: number, state: GameState) => void) | null = null;

  constructor (
    public readonly name: string,
    public readonly description: string
  ) { }


  public addValue (amount: number, _state: GameState): void {
    this.value += amount;
  }

  public isUnlocked (_state: GameState): boolean {
    return true;
  }

}
