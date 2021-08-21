/// <reference path="./IResource.ts" />

class Religion implements IResource {
  public readonly resourceType = ResourceType.Religion;
  public readonly max?: number = null;
  public readonly clickText: string = null;
  public readonly clickDescription: string = null;
  public readonly clickAction: () => void = null;
  public readonly advanceAction: (time: number) => void = null;
  public readonly cost: { [key: string]: number } = null;

  constructor (
    public readonly name: string,
    public readonly description: string,
    public value: number,
  ) { }

  public isUnlocked (state: GameState): boolean {
    return true;
  }
}
