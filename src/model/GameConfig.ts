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
  public cfgInitialMax: ResourceNumber = {
    cryptoCurrency: 1000,
    megaChurches: 2,
    money: 500000,
    playerOrg: 5,
    tents: 5,
  };

  public cfgInitialCost: ResourceNumber = {
    buildingPermit: 250000,
    churches: 150000,
    compounds: 15000,
    cryptoCurrency: 100,
    houses: 75000,
    megaChurches: 750000,
    tents: 250,
  };

  public cfgCostMultiplier: ResourceNumber = {
    churches: 1.01,
    compounds: 1.5,
    cryptoCurrency: 1.1,
    houses: 1.01,
    megaChurches: 1.01,
    tents: 1.05,
  };

  public cfgSalary: ResourceNumber = {
    pastors: 7.5,
  };

  public cfgCapacity: { [key in ResourceKey]?: ResourceNumber } = {
    churches: { pastors: 2 },
    compounds: { churches: 1, houses: 2, money: 500000, tents: 10 },
    houses: { playerOrg: 10 },
    megaChurches: { pastors: 5 },
    tents: { playerOrg: 2 },
  };

  public cfgCredibilityFollowerLossRatio = 0.04;
  public cfgCredibilityFollowerLossTime = 10000;
  public cfgCredibilityRestoreRate = 0.25;
  public cfgCryptoReturnAmount = 1;
  public cfgFollowerGainLossLogTimer = 10000;
  public cfgPassiveMax = 100;
  public cfgPastorRecruitRate = 0.01;
  public cfgPastorTitheCollectionFollowerMax = 100;
  public cfgTimeBetweenTithes = 30000;
  public cfgTitheAmount = 10;

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
    state.addResource(ResourceKey.cryptoCurrency, new CryptoCurrency(this));
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
