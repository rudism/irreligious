/// <reference path="./Infrastructure.ts" />

class House extends Infrastructure {
  public readonly resourceKey = ResourceKey.houses;

  constructor(config: GameConfig) {
    super(
      'Houses',
      'house',
      'houses',
      `Provides room to house ${formatNumber(
        config.cfgCapacity.houses?.followers ?? 0
      )} followers.`,
      true
    );
    this.cost.money = config.cfgInitialCost.houses;
    this._costMultiplier.money = config.cfgCostMultiplier.houses;
  }

  public max = (state: GameState): number =>
    (state.resource.compounds?.value ?? 0) *
    (state.config.cfgCapacity.compounds?.houses ?? 0);

  public inc = (state: GameState): number => {
    // compound managers
    return (
      (state.resource.compoundManagers?.value ?? 0) *
      (state.config.cfgBuySpeed.compoundManagers?.houses ?? 0)
    );
  };

  public isUnlocked = (state: GameState): boolean => {
    if (this._isUnlocked) return true;
    const compounds = state.resource.compounds;
    if (compounds !== undefined && compounds.value > 0) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  };
}
