/// <reference path="../IResource.ts" />

class PlayerOrganization implements IResource {
  public readonly name = 'Player';
  public readonly description = 'In you they trust.';
  public readonly resourceType = ResourceType.Religion;
  public readonly max?: number = null;
  public readonly unlocked = true;

  public value = 0;
}
