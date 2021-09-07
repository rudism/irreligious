/// <reference path="./Passive.ts" />

class Credibility extends Passive {
  constructor(config: GameConfig) {
    super(
      'Credibility',
      'credibility',
      'credibilities',
      'Affects your ability to retain followers and collect tithes.'
    );
    this.value = config.cfgPassiveMax;
  }

  public max: (state: GameState) => number = (state) =>
    state.config.cfgPassiveMax;

  public inc: (state: GameState) => number = (state) =>
    state.config.cfgCredibilityRestoreRate;
}
