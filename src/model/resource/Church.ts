/// <reference path="./Infrastructure.ts" />

class Church extends Infrastructure {
  public readonly resourceKey = ResourceKey.churches;

  constructor(config: GameConfig) {
    super(
      'Churches',
      'church',
      'churches',
      `Preaching grounds for ${formatNumber(
        config.cfgCapacity.churches?.pastors ?? 0
      )} pastors.`,
      true,
      undefined,
      undefined
    );
    this._baseCost.money = config.cfgInitialCost.churches;
    this._costMultiplier.money = config.cfgCostMultiplier.churches;
  }

  public max = (state: GameState): number =>
    (state.resource.compounds?.value ?? 0) *
    (state.config.cfgCapacity.compounds?.churches ?? 0);

  public inc = (state: GameState): ResourceNumber => {
    const inc: ResourceNumber = {};
    const compoundManagers =
      (state.resource.compoundManagers?.value ?? 0) *
      (state.config.cfgBuySpeed.compoundManagers?.churches ?? 0);
    if (compoundManagers > 0) {
      inc.compoundManagers = compoundManagers;
    }
    return inc;
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
