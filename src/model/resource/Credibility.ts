/// <reference path="./Passive.ts" />

class Credibility extends Passive {
  constructor (config: GameConfig) {
    super(
      'credibility',
      'credibilities',
      'Affects your ability to recruit and retain followers.');
    this.value = config.cfgPassiveMax;
  }

  public max: (state: GameState) => number = (state) =>
    state.config.cfgPassiveMax;

  public inc: (state: GameState) => number = (state) =>
    state.config.cfgCredibilityRestoreRate;
}
