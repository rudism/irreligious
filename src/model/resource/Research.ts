/// <reference path="./Purchasable.ts" />

abstract class Research extends Purchasable {
  public readonly resourceType = ResourceType.research;
  public inc = undefined;

  constructor(
    public readonly label: string,
    public readonly singularName: string,
    public readonly pluralName: string,
    public readonly description: string
  ) {
    super(
      label,
      singularName,
      pluralName,
      description,
      'Learn',
      'Complete this research.'
    );
    this.value = 0;
  }

  public max: (state: GameState) => number = (_state) => 1;
}
