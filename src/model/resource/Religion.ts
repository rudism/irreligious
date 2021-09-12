/// <reference path="./Resource.ts" />

class Religion extends Resource {
  public readonly resourceType = ResourceType.religion;
  public readonly valueInWholeNumbers = true;

  constructor(
    public readonly resourceKey: ResourceKey,
    public readonly label: string,
    public readonly singularName: string,
    public readonly pluralName: string,
    public readonly description: string,
    initialValue: number
  ) {
    super();
    this.rawValue = initialValue;
  }

  public isUnlocked = (): boolean => true;
}
