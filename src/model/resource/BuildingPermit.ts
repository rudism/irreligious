/// <reference path="./Research.ts" />

class BuildingPermit extends Research {
  constructor () {
    super('Building Permit',
      'Unlocks several new buildings you can build outside of your compounds.');
    this.cost.money = 250000;
  }

  public isUnlocked (state: GameState): boolean {
    if (this._isUnlocked) return true;
    const compounds: IResource = state.getResource('cmpnd');
    if (compounds.value > 0) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  }
}
