/// <reference path="./GameState.ts" />
/// <reference path="./resource/Credibility.ts" />
/// <reference path="./resource/Money.ts" />
/// <reference path="./resource/PlayerOrg.ts" />
/// <reference path="./resource/Religion.ts" />

class GameConfig {
  public worldPopulation: number = 790000000;

  // religion configs
  public relChristianityShare: number = 0.325;
  public relIslamShare: number = 0.215;
  public relHinduismShare: number = 0.16;
  public relBuddhismShare: number = 0.06;
  public relSikhismShare: number = 0.04;
  public relJudaismShare: number = 0.02;
  public relOtherShare: number = 0.02;
  public relNoneShare: number = 0.16;

  public generateState (): GameState {
    const state: GameState = new GameState();

    // create player organization
    state.addResource('plorg', new PlayerOrg());

    // create world religions
    state.addResource('xtian', new Religion(
      'Christianity', 'God, Jesus, Bible, churches.',
      this.relChristianityShare * this.worldPopulation));

    state.addResource('islam', new Religion(
      'Islam', 'God, Muhammad, Quran, mosques.',
      this.relIslamShare * this.worldPopulation));

    state.addResource('hindu', new Religion(
      'Hinduism', 'Dogma-free spiritualism.',
      this.relHinduismShare * this.worldPopulation));

    state.addResource('buddh', new Religion(
      'Buddhism', 'The minimization of suffering.',
      this.relBuddhismShare * this.worldPopulation));

    state.addResource('sikhi', new Religion(
      'Sikhism', 'Meditation and ten Gurus',
      this.relSikhismShare * this.worldPopulation));

    state.addResource('judah', new Religion(
      'Judaism', 'God, Abraham, Torah, synagogues.',
      this.relJudaismShare * this.worldPopulation));

    state.addResource('other', new Religion(
      'Other', 'A variety of belief systems.',
      this.relOtherShare * this.worldPopulation));

    state.addResource('agnos', new Religion(
      'Non-Religious', 'Atheists and agnostics.',
      this.relNoneShare * this.worldPopulation));

    // add hidden resources
    state.addResource('creds', new Credibility(2));

    // add resources
    state.addResource('money', new Money(100));

    return state;
  }
}
