/// <reference path="./Passive.ts" />

class Credibility extends Passive {
  constructor () {
    super(
      'Credibility',
      'Affects your ability to recruit and retain followers.');
    this.value = 100;
  }

  public max: (state: GameState) => number = (_state) => 100;
  public inc: (state: GameState) => number = (state) =>
    state.config.cfgCredibilityRestoreRate;
}
