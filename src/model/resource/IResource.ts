enum ResourceType {
  Religion,
  Consumable,
  Infrastructure
}

interface IResource {
  name: string;
  description: string;

  resourceType: ResourceType;
  value: number;
  inc: number;
  max?: number;
  cost: { [key: string]: number };

  isUnlocked: (state: GameState) => boolean;

  clickText: string;
  clickDescription: string;
  clickAction: (state: GameState) => void;

  advanceAction: (time: number, state: GameState) => void;
}
