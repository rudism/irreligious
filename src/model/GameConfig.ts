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
  public numberFormatDigits = 1;

  // religion configs
  public relChristianitySharer = 0.325;
  public relIslamShare = 0.215;
  public relHinduismShare = 0.16;
  public relBuddhismShare = 0.06;
  public relSikhismShare = 0.04;
  public relJudaismShare = 0.02;
  public relOtherShare = 0.02;
  public relNoneShare = 0.16;

  // general configs
  public cfgPassiveMax = 100;

  public cfgCredibilityFollowerLossRatio = 0.04;
  public cfgCredibilityFollowerLossTime = 10000;
  public cfgCredibilityRestoreRate = 0.25;

  public cfgFollowerGainLossLogTimer = 10000;
  public cfgFollowerStartingMax = 5;
  public cfgPastorRecruitRate = 0.01;

  public cfgTimeBetweenTithes = 30000;
  public cfgTitheAmount = 10;
  public cfgCryptoReturnAmount = 1;
  public cfgMoneyStartingMax = 500000;
  public cfgPastorTitheCollectionFollowerMax = 100;

  public cfgBuildingPermitCost = 250000;

  public cfgChurchCostMultiplier = 1.01;
  public cfgChurchPastorCapacity = 2;
  public cfgChurchStartingCost = 150000;
  public cfgCompoundChurchCapacity = 1;
  public cfgCompoundCostMultiplier = 1.5;
  public cfgCompoundHouseCapacity = 2;
  public cfgCompoundMoneyCapacity = 500000;
  public cfgCompoundStartingCost = 15000;
  public cfgCompoundTentCapacity = 10;
  public cfgCryptoCostMultiplier = 1.1;
  public cfgCryptoStartingCost = 100;
  public cfgCryptoStartingMax = 1000;
  public cfgHouseCostMultiplier = 1.01;
  public cfgHouseFollowerCapacity = 10;
  public cfgHouseStartingCost = 75000;
  public cfgMegaChurchCostMultiplier = 1.01;
  public cfgMegaChurchPastorCapacity = 5;
  public cfgMegaChurchStartingCost = 7500000;
  public cfgMegaChurchStartingMax = 2;
  public cfgTentCostMultiplier = 1.05;
  public cfgTentFollowerCapacity = 2;
  public cfgTentStartingCost = 250;
  public cfgTentStartingMax = 5;

  public generateState (): GameState {
    const state = new GameState(this);

    // create player organization
    state.addResource(ResourceKey.playerOrg, new PlayerOrg());

    // create world religions
    state.addResource(ResourceKey.christianity, new Religion(
      'Christianity', 'God, Jesus, Bible, churches.',
      this.relChristianitySharer * this.worldPopulation));

    state.addResource(ResourceKey.islam, new Religion(
      'Islam', 'God, Muhammad, Quran, mosques.',
      this.relIslamShare * this.worldPopulation));

    state.addResource(ResourceKey.hinduism, new Religion(
      'Hinduism', 'Dogma-free spiritualism.',
      this.relHinduismShare * this.worldPopulation));

    state.addResource(ResourceKey.buddhism, new Religion(
      'Buddhism', 'The minimization of suffering.',
      this.relBuddhismShare * this.worldPopulation));

    state.addResource(ResourceKey.sikhism, new Religion(
      'Sikhism', 'Meditation and ten Gurus',
      this.relSikhismShare * this.worldPopulation));

    state.addResource(ResourceKey.judaism, new Religion(
      'Judaism', 'God, Abraham, Torah, synagogues.',
      this.relJudaismShare * this.worldPopulation));

    state.addResource(ResourceKey.other, new Religion(
      'Other', 'A variety of belief systems.',
      this.relOtherShare * this.worldPopulation));

    state.addResource(ResourceKey.atheism, new Religion(
      'Non-Religious', 'Atheists and agnostics.',
      this.relNoneShare * this.worldPopulation));

    // add jobs
    state.addResource(ResourceKey.pastors, new Pastor());

    // add resources
    state.addResource(ResourceKey.money, new Money(3.50));
    state.addResource(ResourceKey.faithCoin, new CryptoCurrency(this));
    state.addResource(ResourceKey.tents, new Tent(this));
    state.addResource(ResourceKey.houses, new House(this));
    state.addResource(ResourceKey.churches, new Church(this));
    state.addResource(ResourceKey.compounds, new Compound(this));
    state.addResource(ResourceKey.megaChurches, new MegaChurch(this));

    // add research
    state.addResource(ResourceKey.buildingPermit, new BuildingPermit(this));

    // add passive resources
    state.addResource(ResourceKey.credibility, new Credibility(this));

    return state;
  }

  public formatNumber (num: number): string {
    type UnitLookup = { value: number, symbol: string };
    const lookup: UnitLookup[] = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'G' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let item: UnitLookup | undefined;
    for (item of lookup.slice().reverse()) {
      if (num >= item.value) break;
    }
    return item !== undefined
      ? (num / item.value).toFixed(
        this.numberFormatDigits).replace(rx, '$1') + item.symbol
      : num.toFixed(this.numberFormatDigits).replace(rx, '$1');
  }
}
