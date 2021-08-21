/// <reference path="./Hidden.ts" />

class Credibility extends Hidden {
  private _lastValue: number;

  constructor (public value: number) {
    super(value);
    this._lastValue = value;
  }

  public max (state: GameState): number {
    return 2;
  }

  public inc (state: GameState): number {
    return 0.01;
  }

  public advanceAction (time: number, state: GameState): void {
    if (Math.ceil(this._lastValue) < Math.ceil(this.value)) {
      state.log('Your credibility has gone up.');
    } else if (Math.ceil(this._lastValue) > Math.ceil(this.value)) {
      state.log('Your credibility has gone down.');
    }
    this._lastValue = this.value;
  }
}
