/// <reference path="./Job.ts" />

class Pastor extends Job {
  private _timeSinceLastTithe = 0;

  constructor () {
    super('Pastors',
      'Collect tithings for you and recruit new members from other faiths automatically.');
  }

  public max: (state: GameState) => number = (state) => {
    let max = (state.getResource(ResourceKey.churches)?.value ?? 0)
      * state.config.cfgChurchPastorCapacity;
    max += (state.getResource(ResourceKey.megaChurches)?.value ?? 0)
      * state.config.cfgMegaChurchPastorCapacity;
    return max;
  };

  public isUnlocked (state: GameState): boolean {
    if (this._isUnlocked) return true;
    this._isUnlocked = state.getResource(
      ResourceKey.churches)?.isUnlocked(state) === true;
    return this._isUnlocked;
  }

  public advanceAction (time: number, state: GameState): void {
    this._timeSinceLastTithe += time;
    if (this._timeSinceLastTithe >= state.config.cfgTimeBetweenTithes) {
      const money = state.getResource(ResourceKey.money);
      const plorg = state.getResource(ResourceKey.playerOrg);
      let tithed = this.value
        * state.config.cfgPastorTitheCollectionFollowerMax;
      if (Math.floor(plorg?.value ?? 0) < tithed)
        tithed = Math.floor(plorg?.value ?? 0);
      let collected = tithed * state.config.cfgTitheAmount;
      if (money?.max !== null
        && collected > (money?.max(state) ?? 0) - (money?.value ?? 0))
        collected = (money?.max(state) ?? 0) - (money?.value ?? 0);
      if (collected > 0) {
        money?.addValue(collected, state);
        state.log(`Your pastors collected $${state.config.formatNumber(collected)} in tithings from ${state.config.formatNumber(tithed)} followers.`);
      }
      this._timeSinceLastTithe = 0;
    }
  }
}
