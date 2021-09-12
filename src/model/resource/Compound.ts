/// <reference path="./Infrastructure.ts" />

class Compound extends Infrastructure {
  public readonly resourceKey = ResourceKey.compounds;

  constructor(config: GameConfig) {
    super(
      'Compounds',
      'compound',
      'compounds',
      'Provides space for tents, houses, and churches and a place to hide more money.',
      true
    );
    this.cost.money = config.cfgInitialCost.compounds;
    this._costMultiplier.money = config.cfgCostMultiplier.compounds;
  }

  public isUnlocked = (state: GameState): boolean => {
    if (this._isUnlocked) return true;
    const tents = state.resource.tents;
    if (
      tents !== undefined &&
      tents.value >= (state.config.cfgInitialMax.tents ?? 0)
    ) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  };
}
