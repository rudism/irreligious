enum ResourceType {
  Religion = 'religion',
  Job = 'job',
  Consumable = 'consumable',
  Infrastructure = 'infrastructure',
  Research = 'research',
  Passive = 'passive'
}

interface IResource {
  readonly resourceType: ResourceType;
  readonly name: string | null;
  readonly description: string | null;
  readonly valueInWholeNumbers: boolean;
  readonly clickText: string;
  readonly clickDescription: string;
  readonly altClickText?: string;
  readonly altClickDescription?: string;
  readonly value: number;
  readonly cost: { [key: string]: number };

  max (state: GameState): number | null;
  inc (state: GameState): number | null;
  clickAction(state: GameState): void;
  altClickAction (state: GameState): void;
  addValue (amount: number, state: GameState): void;
  isUnlocked (state: GameState): boolean;
  advanceAction (time: number, state: GameState): void;
}
