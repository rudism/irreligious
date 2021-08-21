/// <reference path="./IResource.ts" />

class PlayerOrganization implements IResource {
  public readonly name = 'Player';
  public readonly description = 'In you they trust.';
  public readonly resourceType = ResourceType.Religion;
  public readonly max?: number = null;
  public readonly unlocked = true;

  public readonly clickText: string = null;
  public readonly clickDescription: string = null;
  public readonly clickAction: () => void = null;

  public readonly advanceAction: (time: number) => void = null;

  public value = 0;

}
