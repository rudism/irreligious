/// <reference path="./Passive.ts" />

class Credibility extends Passive {
  public readonly resourceKey = ResourceKey.credibility;

  constructor(config: GameConfig) {
    super(
      'Credibility',
      'credibility',
      'credibilities',
      'Affects your ability to retain followers and collect tithes.'
    );
    this.rawValue = config.cfgPassiveMax;
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

  public max = (state: GameState): number => state.config.cfgPassiveMax;

  public inc = (state: GameState): ResourceNumber => {
    const inc: ResourceNumber = {};
    inc.credibility = state.config.cfgCredibilityRestoreRate;
    return inc;
  };
}
