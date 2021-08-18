/// <reference path="../IResource.ts" />

class Religion implements IResource {
  public readonly resourceType = ResourceType.Religion;
  public readonly max?: number = null;
  public readonly unlocked = true;

  constructor (
    public readonly name: string,
    public readonly description: string,
    public readonly value: number,
  ) {
  }
}
