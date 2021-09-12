/// <reference path="./Resource.ts" />

abstract class Hidden extends Resource {
  public readonly resourceType = ResourceType.passive;
  public readonly label = undefined;

  public readonly valueInWholeNumbers = false;

  constructor(
    public readonly singularName: string,
    public readonly pluralName: string,
    public readonly description: string
  ) {
    super();
  }

  public isUnlocked = (): boolean => true;
}
