/// <reference path="./Passive.ts" />

class Credibility extends Passive {
  private _lastValue: number = 100;

  constructor () {
    super(
      'Credibility',
      'Affects your ability to recruit and retain followers.',
      100, 100, 0.25);
  }

  public max (state: GameState): number {
    return 100;
  }

  public inc (state: GameState): number {
    return state.config.cfgCredibilityRestoreRate;
  }
}
