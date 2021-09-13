/// <reference path="./Infrastructure.ts" />

class Megachurch extends Infrastructure {
  public readonly resourceKey = ResourceKey.megaChurches;

  constructor(config: GameConfig) {
    super(
      'Megachurches',
      'megachurch',
      'megachurches',
      `Room for ${formatNumber(
        config.cfgCapacity.megaChurches?.pastors ?? 0
      )} pastors`,
      true
    );
    this._baseCost.money = config.cfgInitialCost.megaChurches;
    this._costMultiplier.money = config.cfgCostMultiplier.megaChurches;
  }

  public max = (state: GameState): number =>
    state.config.cfgInitialMax.megaChurches ?? 0;

  public isUnlocked = (state: GameState): boolean => {
    if (this._isUnlocked) return true;
    const permit = state.resource.buildingPermit;
    if (permit !== undefined && permit.value > 0) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  };
}
