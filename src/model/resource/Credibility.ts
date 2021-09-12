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

  public static ratio(state: GameState): number {
    const cred = state.resource.credibility;
    return cred === undefined
      ? 0
      : cred.max === undefined
      ? 0
      : cred.max(state) === 0
      ? 0
      : cred.value / cred.max(state);
  }

  public max: (state: GameState) => number = (state) =>
    state.config.cfgPassiveMax;

  public inc: (state: GameState) => number = (state) =>
    state.config.cfgCredibilityRestoreRate;
}
