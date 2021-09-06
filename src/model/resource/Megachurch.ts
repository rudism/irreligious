/// <reference path="./Infrastructure.ts" />

class Megachurch extends Infrastructure {
  constructor (config: GameConfig) {
    super(
      'megachurch',
      'megachurches',
      `Room for ${formatNumber(config.cfgCapacity.megaChurches?.pastors ?? 0)} pastors`);
    this.cost.money = config.cfgInitialCost.megaChurches;
    this._costMultiplier.money = config.cfgCostMultiplier.megaChurches;
  }

  public max: (state: GameState) => number = (state) =>
    state.config.cfgInitialMax.megaChurches ?? 0;

  public isUnlocked (state: GameState): boolean {
    if (this._isUnlocked) return true;
    const permit = state.resource.buildingPermit;
    if (permit !== undefined && permit.value > 0) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  }
}
