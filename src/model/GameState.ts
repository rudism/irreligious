class GameState {
  public readonly config: GameConfig;

  public onResourceClick: Array<() => void> = [];
  public logger: ILogger | null = null;

  public now = 0;

  private readonly _versionMaj = 0;
  private readonly _versionMin = 1;

  private _timeSinceSave = 0;
  private readonly _timeBetweenSaves = 10000;

  private _resources: { [key in ResourceKey]?: IResource } = { };
  private readonly _resourceKeys: ResourceKey[] = [];

  constructor (config: GameConfig) {
    this.config = config;
  }

  public get resource (): { [key in ResourceKey]?: IResource } {
    return this._resources;
  }

  public get resources (): ResourceKey[] {
    return this._resourceKeys;
  }

  public addResource (key: ResourceKey, resource: IResource): void {
    this._resourceKeys.push(key);
    this._resources[key] = resource;
  }

  public advance (time: number): void {
    this.now = new Date().getTime();

    this._timeSinceSave += time;
    if (this._timeSinceSave >= this._timeBetweenSaves) {
      this.save();
      this._timeSinceSave = 0;
    }

    // advance each resource
    for (const rkey of this._resourceKeys) {
      const resource = this._resources[rkey];
      if (resource?.isUnlocked(this) === true) {
        if (resource.advanceAction !== undefined)
          resource.advanceAction(time, this);
      }
    }

    // perform auto increments
    for (const rkey of this._resourceKeys) {
      const resource = this._resources[rkey];
      if (resource === undefined || !resource.isUnlocked(this)) continue;

      if (resource.inc !== undefined && (resource.max === undefined
        || resource.value < resource.max(this))) {
        resource.addValue(resource.inc(this) * time / 1000, this);
      }

      if (resource.max !== undefined && resource.value > resource.max(this)) {
        resource.addValue((resource.value - resource.max(this)) * -1, this);
      }
      if (resource.value < 0) {
        resource.addValue(resource.value * -1, this);
      }
    }
  }

  public performClick (resourceKey: ResourceKey): void {
    const resource = this._resources[resourceKey];
    if (resource === undefined || !resource.isUnlocked(this)) return;

    if (resource.clickAction !== undefined) {
      resource.clickAction(this);
      for (const callback of this.onResourceClick) {
        callback();
      }
    }
  }

  public deductCost (cost: ResourceNumber | null): boolean {
    if (cost === null) return true;
    if (!this.isPurchasable(cost)) return false;
    for (const key in cost) {
      const rkey = <ResourceKey>key;
      const resource = this._resources[rkey];
      const resCost = cost[rkey];
      if (resource === undefined || resCost === undefined) continue;
      resource.addValue(resCost * -1, this);
    }
    return true;
  }

  public isPurchasable (cost?: ResourceNumber): boolean {
    if (cost === undefined) return true;
    for (const key in cost) {
      const rkey = <ResourceKey>key;
      if ((this._resources[rkey]?.value ?? 0) < (cost[rkey] ?? 0)) {
        return false;
      }
    }
    return true;
  }

  public log (text: string): void {
    if (this.logger !== null) {
      this.logger.msg(text);
    }
  }

  public save (): void {
    const saveObj: SaveData = {};
    saveObj.version = {
      maj: this._versionMaj,
      min: this._versionMin,
    };
    for (const key in this._resources) {
      const rkey = <ResourceKey>key;
      const resource = this._resources[rkey];
      if (resource === undefined) continue;
      saveObj[rkey] = {
        value: resource.value,
        cost: resource.cost,
      };
    }
    const saveStr: string = btoa(JSON.stringify(saveObj));
    localStorage.setItem('savegame', saveStr);
  }

  public load (): void {
    const saveStr: string | null = localStorage.getItem('savegame');
    if (saveStr !== null) {
      try {
        const saveObj: SaveData = <SaveData>JSON.parse(atob(saveStr));
        if (this._versionMaj === saveObj.version?.maj) {
          for (const key in this._resources) {
            const rkey = <ResourceKey>key;
            const saveRes = <{
              value: number;
              cost?: { [key: string]: number };
            } | undefined> saveObj[key];
            if (saveRes !== undefined) {
              // @ts-expect-error writing read-only value from save data
              this._resources[rkey].value = saveRes.value;
              // @ts-expect-error writing read-only cost from save data
              this._resources[rkey].cost = saveRes.cost;
            }
          }
        } else {
          // tslint:disable-next-line
          console.log('The saved game is too old to load.');
        }
      } catch (e: unknown) {
        console.log('There was an error loading the saved game.');
        console.log(e);
      }
    } else {
      console.log('No save game was found.');
    }
  }

  public reset (): void {
    const newState: GameState = this.config.generateState();
    localStorage.clear();
    this._resources = newState._resources;
    this.log('Reset all game resources.');
  }
}

type SaveData = {
  [key: string]: {
    value: number;
    cost?: { [key: string]: number };
  } | { maj: number, min: number } | undefined;
  version?: { maj: number, min: number };
};
