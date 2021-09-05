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
  readonly clickText: string | null;
  readonly clickDescription: string | null;
  // readonly altClickText?: string;
  // readonly altClickDescription?: string;
  readonly value: number;
  readonly cost: { [key in ResourceKey]?: number } | null;

  max: ((state: GameState) => number) | null;
  inc: ((state: GameState) => number) | null;
  clickAction: ((state: GameState) => void) | null;
  // altClickAction (state: GameState): void;
  addValue: (amount: number, state: GameState) => void;
  isUnlocked: (state: GameState) => boolean;
  advanceAction: ((time: number, state: GameState) => void) | null;
}
