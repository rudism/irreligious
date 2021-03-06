/// <reference path="./GameState.ts" />
/// <reference path="./resource/BuildingPermit.ts" />
/// <reference path="./resource/Church.ts" />
/// <reference path="./resource/Compound.ts" />
/// <reference path="./resource/CompoundManager.ts" />
/// <reference path="./resource/Credibility.ts" />
/// <reference path="./resource/CryptoCurrency.ts" />
/// <reference path="./resource/CryptoMarket.ts" />
/// <reference path="./resource/Follower.ts" />
/// <reference path="./resource/House.ts" />
/// <reference path="./resource/Megachurch.ts" />
/// <reference path="./resource/Money.ts" />
/// <reference path="./resource/Pastor.ts" />
/// <reference path="./resource/Religion.ts" />
/// <reference path="./resource/Tent.ts" />

class GameConfig {
  public worldPopulation = 790000000;

  // religion configs
  public cfgReligion: ResourceNumber = {
    christianity: 0.325,
    islam: 0.215,
    hinduism: 0.16,
    buddhism: 0.06,
    sikhism: 0.04,
    judaism: 0.02,
    other: 0.02,
    atheism: 0.16,
  };

  // general configs
  public cfgInitialMax: ResourceNumber = {
    cryptoCurrency: 10000,
    cryptoMarket: 100000000,
    megaChurches: 2,
    money: 500000,
    followers: 5,
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
    compoundManagers: 100,
  };

  public cfgCapacity: { [key in ResourceKey]?: ResourceNumber } = {
    churches: { pastors: 2 },
    compounds: {
      churches: 1,
      compoundManagers: 1,
      houses: 2,
      money: 500000,
      tents: 10,
    },
    houses: { followers: 10 },
    megaChurches: { pastors: 5 },
    tents: { followers: 2 },
  };

  public cfgBuySpeed: { [key in ResourceKey]?: ResourceNumber } = {
    compoundManagers: {
      churches: 0.01,
      houses: 0.02,
      tents: 0.05,
    },
  };

  public cfgCredibilityRestoreRate = 0.25;
  public cfgCryptoCurrencyMinimumValue = 1;
  public cfgCryptoMarketAdjustAmount = 0.1;
  public cfgCryptoMarketAdjustPeriod = 30000;
  public cfgCryptoMarketGrowthBias = 0.1;
  public cfgFollowerGainLossLogTimer = 10000;
  public cfgNoMoneyQuitRate = 0.2;
  public cfgNoMoneyQuitTime = 10000;
  public cfgPassiveMax = 100;
  public cfgPastorRecruitRate = 0.01;
  public cfgSellCostBackMultiplier = 0.5;
  public cfgTimeBetweenTithes = 10000;
  public cfgTitheAmount = 10000;
  public cfgTitheCredibilityHitFactor = 3;

  constructor(public versionMajor: number, public versionMinor: number) {}

  public generateState(): GameState {
    const state = new GameState(this);

    // create player organization
    state.addResource(new Follower());

    // create world religions
    state.addResource(
      new Religion(
        ResourceKey.christianity,
        'Christianity',
        'christian',
        'christians',
        'God, Jesus, Bible, churches.',
        (this.cfgReligion.christianity ?? 0) * this.worldPopulation
      )
    );

    state.addResource(
      new Religion(
        ResourceKey.islam,
        'Islam',
        'muslim',
        'muslims',
        'God, Muhammad, Quran, mosques.',
        (this.cfgReligion.islam ?? 0) * this.worldPopulation
      )
    );

    state.addResource(
      new Religion(
        ResourceKey.hinduism,
        'Hinduism',
        'hindu',
        'hindus',
        'Dogma-free spiritualism.',
        (this.cfgReligion.hinduism ?? 0) * this.worldPopulation
      )
    );

    state.addResource(
      new Religion(
        ResourceKey.buddhism,
        'Buddhism',
        'buddhist',
        'buddhists',
        'The minimization of suffering.',
        (this.cfgReligion.buddhism ?? 0) * this.worldPopulation
      )
    );

    state.addResource(
      new Religion(
        ResourceKey.sikhism,
        'Sikhism',
        'sikh',
        'sikhs',
        'Meditation and ten Gurus',
        (this.cfgReligion.sikhism ?? 0) * this.worldPopulation
      )
    );

    state.addResource(
      new Religion(
        ResourceKey.judaism,
        'Judaism',
        'jew',
        'jews',
        'God, Abraham, Torah, synagogues.',
        (this.cfgReligion.judaism ?? 0) * this.worldPopulation
      )
    );

    state.addResource(
      new Religion(
        ResourceKey.other,
        'Other',
        'person from other faiths',
        'people from other faiths',
        'A variety of belief systems.',
        (this.cfgReligion.other ?? 0) * this.worldPopulation
      )
    );

    state.addResource(
      new Religion(
        ResourceKey.atheism,
        'Non-Religious',
        'atheist',
        'atheists',
        'Atheists and agnostics.',
        (this.cfgReligion.atheism ?? 0) * this.worldPopulation
      )
    );

    // add jobs
    state.addResource(new Pastor());
    state.addResource(new CompoundManager());

    // add resources
    state.addResource(new Money(3.5));
    state.addResource(new CryptoCurrency());
    state.addResource(new Tent(this));
    state.addResource(new House(this));
    state.addResource(new Church(this));
    state.addResource(new Compound(this));
    state.addResource(new Megachurch(this));

    // add research
    state.addResource(new BuildingPermit(this));

    // add passive resources
    state.addResource(new Credibility(this));
    state.addResource(new CryptoMarket(this));

    return state;
  }
}
