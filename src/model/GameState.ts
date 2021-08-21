/// <reference path="./resource/IResource.ts" />

class GameState {
  private _resources: Record<string, IResource> = { };
  private _resourceKeys: string[] = [];

  public onResourceClick: () => void = null;

  public addResource (key: string, resource: IResource): void {
    this._resourceKeys.push(key);
    this._resources[key] = resource;
  }

  public advance (time: number): void {
    for (const rkey of this._resourceKeys) {
      if (this._resources[rkey].advanceAction !== null) {
        this._resources[rkey].advanceAction(time, this);
      }
    }
  }

  public getResources (): string[] {
    return this._resourceKeys;
  }

  public getResource (key: string): IResource {
    return this._resources[key];
  }

  public performClick (resourceKey: string): void {
    if (this._resources[resourceKey].clickAction !== null) {
      this._resources[resourceKey].clickAction(this);
      if (this.onResourceClick !== null) {
        this.onResourceClick();
      }
    }
  }

  public deductCost (cost: { [rkey: string]: number }): boolean {
    if (cost === null || Object.keys(cost) === null) return true;
    for (const rkey of Object.keys(cost)) {
      if (this._resources[rkey].value < cost[rkey]) {
        return false;
      }
    }
    for (const rkey of Object.keys(cost)) {
      this._resources[rkey].value -= cost[rkey];
    }
    return true;
  }
}
