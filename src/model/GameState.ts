/// <reference path="./resource/IResource.ts" />

class GameState {
  private _resources: Record<string, IResource> = { };
  private _resourceKeys: string[] = [];

  public onResourceClick: (() => void)[] = [];

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
      for (const callback of this.onResourceClick) {
        callback();
      }
    }
  }

  public deductCost (cost: { [rkey: string]: number }): boolean {
    if (cost === null || Object.keys(cost) === null) return true;
    if (!this.isPurchasable(cost)) return false;
    for (const rkey of Object.keys(cost)) {
      this._resources[rkey].value -= cost[rkey];
    }
    return true;
  }

  public isPurchasable (cost: { [rkey: string]: number }): boolean {
    if (cost === null || Object.keys(cost) === null) return true;
    for (const rkey of Object.keys(cost)) {
      if (this._resources[rkey].value < cost[rkey]) {
        return false;
      }
    }
    return true;
  }
}
