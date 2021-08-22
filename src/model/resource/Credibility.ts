/// <reference path="./Passive.ts" />

class Credibility extends Passive {
  private _lastValue: number = 100;

  constructor () {
    super(
      'Credibility',
      'Affects your ability to recruit and retain followers.');
    this._baseMax = 100;
    this.value = 100;
  }

  public max (state: GameState): number {
    return 100;
  }

  public inc (state: GameState): number {
    return state.config.cfgCredibilityRestoreRate;
  }
}
