/// <reference path="./Job.ts" />

class Pastor extends Job {
  private _timeSinceLastTithe = 0;

  constructor () {
    super(
      'Pastors',
      'pastor',
      'pastors',
      'Collect tithings for you and recruit new members from other faiths automatically.');
  }

  public max: (state: GameState) => number = (state) => {
    let max = (state.resource.churches?.value ?? 0)
      * (state.config.cfgCapacity.churches?.pastors ?? 0);
    max += (state.resource.megaChurches?.value ?? 0)
      * (state.config.cfgCapacity.megaChurches?.pastors ?? 0);
    return max;
  };

  public isUnlocked (state: GameState): boolean {
    if (this._isUnlocked) return true;
    this._isUnlocked = state.resource.churches?.isUnlocked(state) === true;
    return this._isUnlocked;
  }

  public advanceAction (time: number, state: GameState): void {
    super.advanceAction(time, state);
    this._timeSinceLastTithe += time;
    if (this._timeSinceLastTithe >= state.config.cfgTimeBetweenTithes) {
      const money = state.resource.money;
      const followers = state.resource.followers;
      let tithed = Math.floor(this.value
        * state.config.cfgPastorTitheCollectionFollowerMax);
      if (Math.floor(followers?.value ?? 0) < tithed)
        tithed = Math.floor(followers?.value ?? 0);
      let collected = tithed * state.config.cfgTitheAmount;
      if (money?.max !== undefined
        && collected > money.max(state) - money.value)
        collected = money.max(state) - money.value;
      if (collected > 0) {
        money?.addValue(collected, state);
        if (followers !== undefined) {
          state.log(`Your pastors collected $${formatNumber(collected)} in tithings from ${formatNumber(tithed)} ${tithed > 1 ? followers.pluralName : followers.singularName}.`);
        }
      }
      this._timeSinceLastTithe = 0;
    }
  }
}
