/// <reference path="./Infrastructure.ts" />

class MegaChurch extends Infrastructure {
  constructor (config: GameConfig) {
    super('MegaChurches',
      `Room for ${config.formatNumber(config.cfgMegaChurchPastorCapacity)} pastors`);
    this.cost.money = config.cfgMegaChurchStartingCost;
    this._costMultiplier.money = config.cfgMegaChurchCostMultiplier;
  }

  public max: (state: GameState) => number = (state) =>
    state.config.cfgMegaChurchStartingMax;

  public isUnlocked (state: GameState): boolean {
    if (this._isUnlocked) return true;
    const permit = state.resource.buildingPermit;
    if (permit !== undefined && permit.value > 0) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  }
}
