/// <reference path="./Infrastructure.ts" />

class House extends Infrastructure {
  constructor (config: GameConfig) {
    super(
      'Houses',
      'house',
      'houses',
      `Provides room to house ${formatNumber(config.cfgCapacity.houses?.followers ?? 0)} followers.`);
    this.cost.money = config.cfgInitialCost.houses;
    this._costMultiplier.money = config.cfgCostMultiplier.houses;
  }

  public max: (state: GameState) => number = (state) =>
    (state.resource.compounds?.value ?? 0)
      * (state.config.cfgCapacity.compounds?.houses ?? 0);

  public isUnlocked (state: GameState): boolean {
    if (this._isUnlocked) return true;
    const compounds = state.resource.compounds;
    if (compounds !== undefined && compounds.value > 0) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  }
}
