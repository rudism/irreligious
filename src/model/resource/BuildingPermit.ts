/// <reference path="./Research.ts" />

class BuildingPermit extends Research {
  constructor (config: GameConfig) {
    super(
      'building permit',
      'building permits',
      'Unlocks several new buildings you can build outside of your compounds.');
    this.cost.money = config.cfgInitialMax.buildingPermit;
  }

  public isUnlocked (state: GameState): boolean {
    if (this._isUnlocked) return true;
    const compounds = state.resource.compounds;
    if (compounds !== undefined && compounds.value > 0) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  }
}
