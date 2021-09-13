/// <reference path="./Research.ts" />

class BuildingPermit extends Research {
  public readonly resourceKey = ResourceKey.buildingPermit;

  constructor(config: GameConfig) {
    super(
      'Building Permit',
      'building permit',
      'building permits',
      'Unlocks several new buildings you can build outside of your compounds.'
    );
    this._baseCost.money = config.cfgInitialCost.buildingPermit;
  }

  public isUnlocked = (state: GameState): boolean => {
    if (this._isUnlocked) return true;
    const compounds = state.resource.compounds;
    if (compounds !== undefined && compounds.value > 0) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  };
}
