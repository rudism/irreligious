/// <reference path="./Purchasable.ts" />

abstract class Research extends Purchasable {
  public readonly resourceType: ResourceType = ResourceType.research;

  constructor (
    public readonly name: string,
    public readonly description: string
  ) {
    super(name, description);
    this.value = 0;
    this.clickText = 'Learn';
    this.clickDescription = 'Complete this research.';
  }

  public max: (_state: GameState) => number = (_state) => 1;
}
