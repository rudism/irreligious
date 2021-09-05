enum ResourceType {
  religion = 'religion',
  job = 'job',
  consumable = 'consumable',
  infrastructure = 'infrastructure',
  research = 'research',
  passive = 'passive',
}

enum ResourceKey {
  playerOrg = 'plorg',
  christianity = 'xtian',
  islam = 'islam',
  hinduism = 'hindu',
  buddhism = 'buddh',
  sikhism = 'sikhi',
  judaism = 'judah',
  other = 'other',
  atheism = 'agnos',
  pastors = 'pstor',
  money = 'money',
  faithCoin = 'crpto',
  tents = 'tents',
  houses = 'houses',
  churches = 'chrch',
  compounds = 'cmpnd',
  buildingPermit = 'blpmt',
  megaChurches = 'mchch',
  credibility = 'creds',
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
