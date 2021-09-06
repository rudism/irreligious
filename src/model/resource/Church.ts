/// <reference path="./Infrastructure.ts" />

class Church extends Infrastructure {
  constructor (config: GameConfig) {
    super('Churches',
      `Preaching grounds for ${config.formatNumber(config.cfgCapacity.churches?.pastors ?? 0)} pastors.`);
    this.cost.money = config.cfgInitialCost.churches;
    this._costMultiplier.money = config.cfgCostMultiplier.churches;
  }

  public max: (state: GameState) => number = (state) =>
    (state.resource.compounds?.value ?? 0)
      *  (state.config.cfgCapacity.compounds?.churches ?? 0);

  public isUnlocked (state: GameState): boolean {
    if (this._isUnlocked) return true;
    const compounds = state.resource.compounds;
    if (compounds !== undefined && compounds.value > 0) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  }
}
