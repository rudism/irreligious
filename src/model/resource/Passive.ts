/// <reference path="./Resource.ts" />

abstract class Passive extends Resource {
  public readonly resourceType = ResourceType.passive;

  public readonly valueInWholeNumbers = false;

  constructor(
    public readonly label: string,
    public readonly singularName: string,
    public readonly pluralName: string,
    public readonly description: string
  ) {
    super();
  }

  public isUnlocked = (): boolean => true;
}
