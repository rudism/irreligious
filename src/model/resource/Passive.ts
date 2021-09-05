/// <reference path="./IResource.ts" />

abstract class Passive implements IResource {
  public readonly resourceType: ResourceType = ResourceType.passive;
  public readonly valueInWholeNumbers: boolean = false;
  public readonly clickText: null = null;
  public readonly clickDescription: null = null;
  public value = 0;
  public readonly cost: null = null;

  public readonly clickAction: null = null;

  public max: ((state: GameState) => number) | null = null;
  public inc: ((state: GameState) => number) | null = null;
  public advanceAction: ((time: number, state: GameState) => void) | null = null;

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
