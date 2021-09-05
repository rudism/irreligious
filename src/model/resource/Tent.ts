/// <reference path="./Infrastructure.ts" />

class Tent extends Infrastructure {
  constructor (config: GameConfig) {
    super('Tents',
      `Provides room to house ${config.formatNumber(config.cfgTentFollowerCapacity)} followers.`);
    this.cost.money = config.cfgTentStartingCost;
    this._costMultiplier.money = config.cfgTentCostMultiplier;
  }

  public max: (state: GameState) => number = (state) => {
    // ten extra tents per compound
    let max = state.config.cfgTentStartingMax;
    max += (state.resource.compounds?.value ?? 0)
      * state.config.cfgCompoundTentCapacity;
    return max;
  };
}
