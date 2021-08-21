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
  max?: number;
  unlocked: boolean;

  clickText: string;
  clickDescription: string;
  clickAction: (state: GameState) => void;

  advanceAction: (time: number, state: GameState) => void;
}
