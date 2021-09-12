/// <reference path="./Infrastructure.ts" />

class Tent extends Infrastructure {
  public readonly resourceKey = ResourceKey.tents;

  constructor(config: GameConfig) {
    super(
      'Tents',
      'tent',
      'tents',
      `Provides room to house ${formatNumber(
        config.cfgCapacity.tents?.followers ?? 0
      )} followers.`,
      true
    );
    this.cost.money = config.cfgInitialCost.tents;
    this._costMultiplier.money = config.cfgCostMultiplier.tents;
  }

  public max = (state: GameState): number => {
    // ten extra tents per compound
    let max = state.config.cfgInitialMax.tents ?? 0;
    max +=
      (state.resource.compounds?.value ?? 0) *
      (state.config.cfgCapacity.compounds?.tents ?? 0);
    return max;
  };

  public inc = (state: GameState): number =>
    // compound managers
    (state.resource.compoundManagers?.value ?? 0) *
    (state.config.cfgBuySpeed.compoundManagers?.tents ?? 0);
}
