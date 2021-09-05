class GameState {
  public readonly config: GameConfig;

  public onResourceClick: Array<() => void> = [];
  public logger: ILogger | null = null;
  public numberFormatDigits = 1;

  public now = 0;

  private readonly _versionMaj: number = 0;
  private readonly _versionMin: number = 1;

  private _timeSinceSave = 0;
  private readonly _timeBetweenSaves: number = 10000;

  private _resources: { [key: string]: IResource } = { };
  private readonly _resourceKeys: string[] = [];


  constructor (config: GameConfig) {
    this.config = config;
  }

  public addResource (key: string, resource: IResource): void {
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
      if (this._resources[rkey].isUnlocked(this)) {
        if (resource.advanceAction !== null)
          resource.advanceAction(time, this);
      }
    }

    // perform auto increments
    for (const rkey of this._resourceKeys) {
      const resource = this._resources[rkey];
      if (!resource.isUnlocked(this)) continue;

      if (resource.inc !== null && (resource.max === null
        || this._resources[rkey].value < resource.max(this))) {
        this._resources[rkey].addValue(resource.inc(this) * time / 1000, this);
      }

      if (resource.max !== null && resource.value > resource.max(this)) {
        this._resources[rkey].addValue(
          (resource.value - resource.max(this)) * -1, this);
      }
      if (resource.value < 0) {
        this._resources[rkey].addValue(resource.value * -1, this);
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
    const resource = this._resources[resourceKey];
    if (!resource.isUnlocked(this)) return;

    if (resource.clickAction !== null) {
      resource.clickAction(this);
      for (const callback of this.onResourceClick) {
        callback();
      }
    }
  }

  public deductCost (cost: { [rkey: string]: number } | null): boolean {
    if (cost === null) return true;
    if (!this.isPurchasable(cost)) return false;
    for (const rkey of Object.keys(cost)) {
      this._resources[rkey].addValue(cost[rkey] * -1, this);
    }
    return true;
  }

  public isPurchasable (cost: { [rkey: string]: number } | null): boolean {
    if (cost === null) return true;
    for (const rkey of Object.keys(cost)) {
      if (this._resources[rkey].value < cost[rkey]) {
        return false;
      }
    }
    return true;
  }

  public formatNumber (num: number): string {
    type UnitLookup = { value: number, symbol: string };
    const lookup: UnitLookup[] = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'G' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let item: UnitLookup | undefined;
    for (item of lookup.slice().reverse()) {
      if (num >= item.value) break;
    }
    return item !== undefined
      ? (num / item.value).toFixed(
        this.numberFormatDigits).replace(rx, '$1') + item.symbol
      : num.toFixed(this.numberFormatDigits).replace(rx, '$1');
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
    for (const rkey of this._resourceKeys) {
      saveObj[rkey] = {
        value: this._resources[rkey].value,
        cost: this._resources[rkey].cost,
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
          for (const rkey of this._resourceKeys) {
            const saveRes = <{
              value: number;
              cost: { [key: string]: number } | null;
            } | undefined> saveObj[rkey];
            if (saveRes !== undefined) {
              // @ts-expect-error writing read-only value from save data
              this._resources[rkey].value = saveRes.value;
              // @ts-expect-error writing read-only cost from save data
              this._resources[rkey].cost = saveRes.cost ?? null;
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
    cost: { [key: string]: number } | null;
  } | { maj: number, min: number } | undefined;
  version?: { maj: number, min: number };
};
