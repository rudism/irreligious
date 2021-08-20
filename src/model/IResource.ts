enum ResourceType {
  Religion,
  Consumable
}

interface IResource {
  name: string;
  description: string;

  resourceType: ResourceType;
  value: number;
  max?: number;
  unlocked: boolean;
}
