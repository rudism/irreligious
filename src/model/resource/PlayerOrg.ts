/// <reference path="./IResource.ts" />

class PlayerOrg implements IResource {
  public readonly resourceType: ResourceType = ResourceType.Religion;
  public readonly name: string = 'Player';
  public readonly description: string = 'In you they trust.';
  public readonly valueInWholeNumbers: boolean = true;
  public readonly clickText: string = 'Recruit';
  public readonly clickDescription: string = 'Gather new followers.';
  public value: number = 0;
  public readonly cost: { [key: string]: number } = { };

  public readonly inc: null = null;

  private _lastLostTime: number = 0;
  private _baseMax: number = 5;

  public max (state: GameState): number {
    let max: number = this._baseMax;
    max += state.getResource('tents').value * 2;
    max += state.getResource('house').value * 10;
    return max;
  }

  public clickAction (state: GameState): void {
    // don't exceed max
    if (this.value >= this.max(state)) {
      state.log('You have no room for more followers.');
      return;
    }

    // chance to fail increases as credibility decreases
    const creds: IResource = state.getResource('creds');
    const ratio: number = Math.ceil(creds.value) / creds.max(state);
    if (Math.random() > ratio) {
      state.log('Your recruiting efforts failed.');
      return;
    }

    const source: [string, IResource] = this._getRandomReligion(state);
    this.cost[source[0]] = 1;
    if (state.deductCost(this.cost)) {
      this.value++;
      delete this.cost[source[0]];
      state.log(`You converted one new follower from ${source[1].name}!`);
    } else {
      state.log('Your recruiting efforts failed.');
    }
  }

  public addValue (amount: number, state: GameState): void {
    this.value += amount;
  }

  public isUnlocked (state: GameState): boolean {
    return true;
  }

  public advanceAction (time: number, state: GameState): void {
    // chance to lose some followers every 10s if credibility < 100%
    if (state.now - this._lastLostTime > 10000) {
      if (this.value > 0) {
        const creds: IResource = state.getResource('creds');
        const ratio: number = Math.ceil(creds.value) / creds.max(state);
        if (Math.random() > ratio) {
          const lost: number = Math.ceil(this.value / 25 * (1 - ratio));
          this.addValue(lost * -1, state);
          const dest: [string, IResource] = this._getRandomReligion(state);
          dest[1].addValue(lost, state);
          state.log(`You lost ${lost} followers to ${dest[1].name}.`);
        }
      }
      this._lastLostTime = state.now;
    }
  }

  private _getRandomReligion (state: GameState): [string, IResource] {
    const religs: string[] = ['xtian', 'islam', 'hindu',
      'buddh', 'sikhi', 'judah', 'other', 'agnos'];
    const source: string = religs[Math.floor(Math.random() * 8)];
    return [source, state.getResource(source)];
  }
}
