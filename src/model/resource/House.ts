/// <reference path="./Infrastructure.ts" />

class House extends Infrastructure {
  constructor (config: GameConfig) {
    super('Houses',
      `Provides room to house ${config.formatNumber(config.cfgHouseFollowerCapacity)} followers.`);
    this.cost.money = config.cfgHouseStartingCost;
    this._costMultiplier.money = config.cfgHouseCostMultiplier;
  }

  public max: (state: GameState) => number = (state) =>
    (state.resource.compounds?.value ?? 0)
      * state.config.cfgCompoundHouseCapacity;

  public isUnlocked (state: GameState): boolean {
    if (this._isUnlocked) return true;
    const compounds = state.resource.compounds;
    if (compounds !== undefined && compounds.value > 0) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  }
}
