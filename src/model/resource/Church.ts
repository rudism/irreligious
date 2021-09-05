/// <reference path="./Infrastructure.ts" />

class Church extends Infrastructure {
  constructor (config: GameConfig) {
    super('Churches',
      `Preaching grounds for ${config.formatNumber(config.cfgChurchPastorCapacity)} pastors.`);
    this.cost.money = config.cfgChurchStartingCost;
    this._costMultiplier.money = config.cfgChurchCostMultiplier;
  }

  public max: (state: GameState) => number = (state) =>
    state.getResource(ResourceKey.compounds)?.value ?? 0;

  public isUnlocked (state: GameState): boolean {
    if (this._isUnlocked) return true;
    const compounds = state.getResource(ResourceKey.compounds);
    if (compounds != null && compounds.value > 0) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  }
}
