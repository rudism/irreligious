/// <reference path="../GameState.ts" />

enum ResourceType {
  religion = 'religion',
  job = 'job',
  consumable = 'consumable',
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
  money = 'money',
  cryptoCurrency = 'cryptoCurrency',
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
