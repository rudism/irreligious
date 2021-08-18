/// <reference path="./IResource.ts" />

class GameState {
  private _resources: {[key: string]: IResource} = {};

  public addResource (key: string, resource: IResource): void {
    this._resources[key] = resource;
  }

  public advance (time: number): void {
    console.log(`Advancing state by ${time}ms...`);
  }
}
