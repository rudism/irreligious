enum ResourceType {
  religion = 'religion',
  job = 'job',
  consumable = 'consumable',
  infrastructure = 'infrastructure',
  research = 'research',
  passive = 'passive',
}

enum ResourceKey {
  playerOrg = 'playerOrg',
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

interface IResource {
  readonly resourceType: ResourceType;
  readonly name: string;
  readonly description: string;
  readonly valueInWholeNumbers: boolean;

  readonly value: number;
  readonly cost?: { [key in ResourceKey]?: number };

  readonly clickText?: string;
  readonly clickDescription?: string;
  // readonly altClickText?: string;
  // readonly altClickDescription?: string;

  max?: (state: GameState) => number;
  inc?: (state: GameState) => number;
  clickAction?: (state: GameState) => void;
  // altClickAction (state: GameState): void;
  advanceAction?: (time: number, state: GameState) => void;

  addValue: (amount: number, state: GameState) => void;
  isUnlocked: (state: GameState) => boolean;
}
