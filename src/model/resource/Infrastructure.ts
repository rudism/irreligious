/// <reference path="./Purchasable.ts" />

abstract class Infrastructure extends Purchasable {
  public readonly resourceType = ResourceType.infrastructure;
}
