/// <reference path="./Job.ts" />

class CompoundManager extends Job {
  constructor() {
    super(
      'Compound Managers',
      'compound manager',
      'compound managers',
      'Automatically purchase tents, houses, and churches when money and compound space permits.'
    );
  }

  public max: (state: GameState) => number = (state) => {
    return (
      (state.resource.compounds?.value ?? 0) *
      (state.config.cfgCapacity.compounds?.compoundManagers ?? 0)
    );
  };

  public isUnlocked(state: GameState): boolean {
    if (this._isUnlocked) return true;
    this._isUnlocked = state.resource.compounds?.isUnlocked(state) === true;
    return this._isUnlocked;
  }
}
