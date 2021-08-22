class GameState {
  private _resources: Record<string, IResource> = { };
  private _resourceKeys: string[] = [];

  public onResourceClick: (() => void)[] = [];
  public logger: ILogger = null;
  public numberFormatDigits: number = 1;

  public now: number = 0;

  public addResource (key: string, resource: IResource): void {
    this._resourceKeys.push(key);
    this._resources[key] = resource;
  }

  public advance (time: number): void {
    this.now = (new Date()).getTime();

    // advance each resource
    for (const rkey of this._resourceKeys) {
      if (this._resources[rkey].isUnlocked(this)
        && this._resources[rkey].advanceAction !== null) {
        this._resources[rkey].advanceAction(time, this);
      }
    }

    // perform auto increments
    for (const rkey of this._resourceKeys) {
      if (!this._resources[rkey].isUnlocked(this)) continue;

      const max: number = this._resources[rkey].max
        ? this._resources[rkey].max(this)
        : null;
      const inc: number = this._resources[rkey].inc
        ? this._resources[rkey].inc(this)
        : 0;
      if (inc > 0 && (max === null
        || this._resources[rkey].value < max)) {
        this._resources[rkey].value += inc * time / 1000;
      }
      if (max !== null && this._resources[rkey].value > max) {
        this._resources[rkey].value = max;
      }
      if (this._resources[rkey].value < 0) {
        this._resources[rkey].value = 0;
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

  public formatNumber (num: number): string {
    type vlookup = { value: number, symbol: string };
    const lookup: vlookup[] = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'G' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' }
    ];
    const rx: RegExp = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item: vlookup =
      lookup.slice().reverse()
        .find((i: vlookup): boolean => num >= i.value);
    return item
      ? (num / item.value).toFixed(this.numberFormatDigits)
        .replace(rx, '$1') + item.symbol
      : num.toFixed(this.numberFormatDigits).replace(rx, '$1');
  }

  public log (text: string): void {
    if (this.logger !== null) {
      this.logger.msg(text);
    }
  }
}
