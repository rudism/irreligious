/// <reference path="./Purchasable.ts" />

abstract class Research extends Purchasable {
  public readonly resourceType: ResourceType = ResourceType.Research;

  constructor (
    public readonly name: string,
    public readonly description: string
  ) {
    super(name, description);
    this.value = 0;
    this._baseMax = 1;
    this.clickText = 'Learn';
    this.clickDescription = 'Complete this research.'
  }
}
