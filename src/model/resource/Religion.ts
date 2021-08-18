/// <reference path="../GameConfig.ts" />
/// <reference path="../IResource.ts" />

class Religion implements IResource {
  public readonly description: string;
  public readonly resourceType: ResourceType = ResourceType.Religion;

  public value: number;
  public max: number;

  constructor (
    config: GameConfig,
    public readonly name: string,
    populationShare: number
  ) {
    this.description = name;
    this.max = config.worldPopulation;
    this.value = config.worldPopulation * populationShare;
  }
}
