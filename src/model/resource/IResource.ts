enum ResourceType {
  Religion = 'religion',
  Consumable = 'consumable',
  Infrastructure = 'infrastructure',
  Hidden = 'hidden'
}

interface IResource {
  name: string | null;
  description: string | null;

  resourceType: ResourceType;
  value: number;

  clickText: string;
  clickDescription: string;

  clickAction (state: GameState): void;

  cost: { [key: string]: number };

  max (state: GameState): number | null;
  inc (state: GameState): number | null;

  isUnlocked (state: GameState): boolean;

  advanceAction (time: number, state: GameState): void;
}
