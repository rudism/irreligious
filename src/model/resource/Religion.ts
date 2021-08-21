/// <reference path="./IResource.ts" />

class Religion implements IResource {
  public readonly resourceType: ResourceType = ResourceType.Religion;
  public readonly clickText: string = null;
  public readonly clickDescription: string = null;
  public readonly advanceAction: (time: number) => void = null;
  public readonly cost: { [key: string]: number } = null;

  public readonly max: () => null = (): null => null;
  public readonly inc: () => null = (): null => null;
  public readonly clickAction: () => void = null;

  constructor (
    public readonly name: string,
    public readonly description: string,
    public value: number,
  ) { }

  public isUnlocked (state: GameState): boolean {
    return true;
  }
}
