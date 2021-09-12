/// <reference path="../GameState.ts" />

enum ResourceType {
  religion = 'religion',
  job = 'job',
  purchasable = 'purchasable',
  infrastructure = 'infrastructure',
  research = 'research',
  passive = 'passive',
}

enum ResourceKey {
  followers = 'followers',
  christianity = 'christianity',
  islam = 'islam',
  hinduism = 'hinduism',
  buddhism = 'buddhism',
  sikhism = 'sikhism',
  judaism = 'judaism',
  other = 'other',
  atheism = 'atheism',
  pastors = 'pastors',
  compoundManagers = 'compoundManagers',
  money = 'money',
  cryptoCurrency = 'cryptoCurrency',
  cryptoMarket = 'cryptoMarket',
  tents = 'tents',
  houses = 'houses',
  churches = 'churches',
  compounds = 'compounds',
  buildingPermit = 'buildingPermit',
  megaChurches = 'megaChurches',
  credibility = 'credibility',
}

type ResourceNumber = { [key in ResourceKey]?: number };

type ResourceAction = {
  name: string;
  description: string;
  isEnabled: (state: GameState) => boolean;
  performAction: (state: GameState) => void;
};

type ResourceConfigValues = { [key: string]: string | number | boolean };

type ResourceConfig = {
  value: number;
  config?: ResourceConfigValues;
};

type SaveData = {
  version: { maj: number; min: number };
  resources: { [key in ResourceKey]?: ResourceConfig };
};
