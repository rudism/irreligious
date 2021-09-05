/// <reference path="./GameState.ts" />
/// <reference path="./resource/BuildingPermit.ts" />
/// <reference path="./resource/Church.ts" />
/// <reference path="./resource/Compound.ts" />
/// <reference path="./resource/Credibility.ts" />
/// <reference path="./resource/CryptoCurrency.ts" />
/// <reference path="./resource/House.ts" />
/// <reference path="./resource/MegaChurch.ts" />
/// <reference path="./resource/Money.ts" />
/// <reference path="./resource/Pastor.ts" />
/// <reference path="./resource/PlayerOrg.ts" />
/// <reference path="./resource/Religion.ts" />
/// <reference path="./resource/Tent.ts" />

class GameConfig {
  public worldPopulation = 790000000;

  // religion configs
  public relChristianitySharer = 0.325;
  public relIslamShare = 0.215;
  public relHinduismShare = 0.16;
  public relBuddhismShare = 0.06;
  public relSikhismShare = 0.04;
  public relJudaismShare = 0.02;
  public relOtherShare = 0.02;
  public relNoneShare = 0.16;

  public cfgStartingPlayerMax = 5;
  public cfgStartingMoneyMax = 500000;
  public cfgStartingTentMax = 5;
  public cfgStartingCryptoMax = 1000;
  public cfgStartingMegaChurchMax = 2;

  public cfgTitheAmount = 10;
  public cfgTimeBetweenTithes = 30000;
  public cfgCryptoReturnAmount = 1;
  public cfgCredibilityRestoreRate = 0.25;
  public cfgPastorRecruitRate = 0.01;

  public generateState (): GameState {
    const state: GameState = new GameState(this);

    // create player organization
    state.addResource('plorg', new PlayerOrg());

    // create world religions
    state.addResource('xtian', new Religion(
      'Christianity', 'God, Jesus, Bible, churches.',
      this.relChristianitySharer * this.worldPopulation));

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

    // add jobs
    state.addResource('pstor', new Pastor());

    // add resources
    state.addResource('money', new Money(3.50));
    state.addResource('crpto', new CryptoCurrency());
    state.addResource('tents', new Tent());
    state.addResource('house', new House());
    state.addResource('chrch', new Church());
    state.addResource('cmpnd', new Compound());
    state.addResource('blpmt', new BuildingPermit());
    state.addResource('mchch', new MegaChurch());

    // add passive resources
    state.addResource('creds', new Credibility());

    return state;
  }
}
