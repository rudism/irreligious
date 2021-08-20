/// <reference path="../IResource.ts" />

class Consumable implements IResource {
  public readonly resourceType = ResourceType.Consumable;

  constructor (
    public readonly name: string,
    public readonly description: string,
    public value: number,
    public unlocked: boolean,
    public max?: number,
  ) {
  }
}
