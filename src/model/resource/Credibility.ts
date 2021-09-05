/// <reference path="./Passive.ts" />

class Credibility extends Passive {
  constructor () {
    super(
      'Credibility',
      'Affects your ability to recruit and retain followers.');
    this._baseMax = 100;
    this.value = 100;
  }

  public max (): number {
    return 100;
  }

  public inc (state: GameState): number {
    return state.config.cfgCredibilityRestoreRate;
  }
}
