/// <reference path="./Religion.ts" />

class PlayerOrg implements IResource {
  public readonly resourceType: ResourceType = ResourceType.Religion;
  public readonly name: string = 'Player';
  public readonly description: string = 'In you they trust.';

  public cost: { [key: string]: number } = { };
  public readonly max: null = null;
  public readonly inc: null = null;

  public value: number = 0;

  public clickText: string = 'Recruit';
  public clickDescription: string = 'Gather new followers.';

  private _lastLostTime: number = 0;

  public isUnlocked (state: GameState): boolean {
    return true;
  }

  public clickAction (state: GameState): void {
    const creds: number =
      Math.pow(Math.ceil(state.getResource('creds').value), 2);
    if (this.value >= creds) {
      state.log('Your recruiting efforts failed.');
    } else {
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
  }

  public advanceAction (time: number, state: GameState): void {
    const creds: number =
      Math.pow(Math.ceil(state.getResource('creds').value), 2);
    if (this.value > creds) {
      if (state.now - this._lastLostTime > 10000) {
        const lost: number =
          Math.ceil((this.value - creds) / 10 * Math.random());
        this.value -= lost;
        const dest: [string, IResource] = this._getRandomReligion(state);
        dest[1].value += lost;
        state.log(`You lost ${lost} followers to ${dest[1].name}.`);
        this._lastLostTime = state.now;
      }
    }
  }

  private _getRandomReligion (state: GameState): [string, IResource] {
    const religs: string[] = ['xtian', 'islam', 'hindu',
      'buddh', 'sikhi', 'judah', 'other', 'agnos'];
    const source: string = religs[Math.floor(Math.random() * 8)];
    return [source, state.getResource(source)];
  }
}
