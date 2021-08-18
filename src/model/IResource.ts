enum ResourceType {
  Religion
}

interface IResource {
  name: string,
  description: string,
  resourceType: ResourceType,
  value: number,
  max: number
}
