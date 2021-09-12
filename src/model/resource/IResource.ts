/// <reference path="./SharedTypes.ts" />

interface IResource {
  readonly resourceType: ResourceType;
  readonly resourceKey: ResourceKey;

  readonly label?: string;
  readonly singularName: string;
  readonly pluralName: string;
  readonly description: string;
  readonly valueInWholeNumbers: boolean;

  readonly cost?: ResourceNumber;

  max?: (state: GameState) => number;
  inc?: (state: GameState) => number;
  advanceAction?: (time: number, state: GameState) => void;
  userActions?: ResourceAction[];

  addValue: (amount: number, state: GameState) => void;
  isUnlocked: (state: GameState) => boolean;

  restoreConfig: (config: ResourceConfig) => void;
  emitConfig?: () => ResourceConfigValues;

  get value(): number;
}
