enum ResourceType {
  Religion = 'religion',
  Job = 'job',
  Consumable = 'consumable',
  Infrastructure = 'infrastructure',
  Passive = 'passive'
}

interface IResource {
  name: string | null;
  description: string | null;

  resourceType: ResourceType;
  value: number;
  valueInWholeNumbers: boolean;

  clickText: string;
  clickDescription: string;

  clickAction (state: GameState): void;

  cost: { [key: string]: number };

  max (state: GameState): number | null;
  inc (state: GameState): number | null;

  isUnlocked (state: GameState): boolean;

  advanceAction (time: number, state: GameState): void;
}
