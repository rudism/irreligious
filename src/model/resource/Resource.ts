/// <reference path="./IResource.ts" />

abstract class Resource implements IResource {
  public inc?: (state: GameState) => ResourceNumber = undefined;
  public cost?: (state: GameState) => ResourceNumber = undefined;
  public max?: (state: GameState) => number = undefined;

  protected rawValue = 0;

  public abstract readonly resourceType: ResourceType;
  public abstract readonly resourceKey: ResourceKey;

  public abstract readonly label?: string;
  public abstract readonly singularName: string;
  public abstract readonly pluralName: string;
  public abstract readonly description: string;
  public abstract valueInWholeNumbers: boolean;

  public abstract isUnlocked: (state: GameState) => boolean;

  public get value(): number {
    return this.valueInWholeNumbers ? Math.floor(this.rawValue) : this.rawValue;
  }

  public addValue = (amount: number, _: GameState): void => {
    this.rawValue += amount;
  };

  public restoreConfig = (config: ResourceConfig): void => {
    this.rawValue = config.value;
  };
}
