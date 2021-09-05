/// <reference path="./Infrastructure.ts" />

class Compound extends Infrastructure {
  constructor (config: GameConfig) {
    super('Compounds',
      'Provides space for tents, houses, and churches and a place to hide more money.');
    this.cost.money = config.cfgCompoundStartingCost;
    this._costMultiplier.money = config.cfgCompoundCostMultiplier;
  }

  public isUnlocked (state: GameState): boolean {
    if (this._isUnlocked) return true;
    const tents = state.getResource(ResourceKey.tents);
    if (tents !== null && tents.value >= state.config.cfgTentStartingMax) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  }
}
