/// <reference path="./Job.ts" />

class Pastor extends Job {
  private _timeSinceLastTithe = 0;

  constructor () {
    super('Pastors',
      'Collect tithings for you and recruit new members from other faiths automatically.');
  }

  public max (state: GameState): number {
    return state.getResource('chrch').value * 2;
  }

  public isUnlocked (state: GameState): boolean {
    if (this._isUnlocked) return true;
    this._isUnlocked = state.getResource('chrch').isUnlocked(state);
    return this._isUnlocked;
  }

  public advanceAction (time: number, state: GameState): void {
    this._timeSinceLastTithe += time;
    if (this._timeSinceLastTithe >= state.config.cfgTimeBetweenTithes) {
      const money: IResource = state.getResource('money');
      const plorg: IResource = state.getResource('plorg');
      // each pastor can collect from up to 100 followers
      let tithed: number = this.value * 100;
      if (Math.floor(plorg.value) < tithed)
        tithed = Math.floor(plorg.value);
      let collected: number = tithed * state.config.cfgTitheAmount;
      if (collected > money.max(state) - money.value)
        collected = money.max(state) - money.value;
      if (collected > 0) {
        money.addValue(collected, state);
        state.log(`Your pastors collected $${state.formatNumber(collected)} in tithings from ${state.formatNumber(tithed)} followers.`);
      }
      this._timeSinceLastTithe = 0;
    }
  }
}
