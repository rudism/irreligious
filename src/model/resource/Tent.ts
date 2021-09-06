/// <reference path="./Infrastructure.ts" />

class Tent extends Infrastructure {
  constructor (config: GameConfig) {
    super('Tents',
      `Provides room to house ${config.formatNumber(config.cfgCapacity.tents?.playerOrg ?? 0)} followers.`);
    this.cost.money = config.cfgInitialCost.tents;
    this._costMultiplier.money = config.cfgCostMultiplier.tents;
  }

  public max: (state: GameState) => number = (state) => {
    // ten extra tents per compound
    let max = state.config.cfgInitialMax.tents ?? 0;
    max += (state.resource.compounds?.value ?? 0)
      * (state.config.cfgCapacity.compounds?.tents ?? 0);
    return max;
  };
}
