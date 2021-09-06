/// <reference path="./SharedTypes.ts" />

interface IResource {
  readonly resourceType: ResourceType;
  readonly label?: string;
  readonly singularName: string;
  readonly pluralName: string;
  readonly description: string;
  readonly valueInWholeNumbers: boolean;

  readonly value: number;
  readonly cost?: ResourceNumber;

  max?: (state: GameState) => number;
  inc?: (state: GameState) => number;
  advanceAction?: (time: number, state: GameState) => void;
  userActions?: ResourceAction[];

  addValue: (amount: number, state: GameState) => void;
  isUnlocked: (state: GameState) => boolean;
}
