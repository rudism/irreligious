/// <reference path="./IResource.ts" />

class PlayerOrg implements IResource {
  public readonly resourceType = ResourceType.religion;
  public readonly name = 'Player';
  public readonly description = 'In you they trust.';
  public readonly valueInWholeNumbers = true;
  public readonly clickText = 'Recruit';
  public readonly clickDescription = 'Gather new followers.';
  public value = 0;
  public readonly cost = null;

  private _timeSinceLastLost = 0;
  private _lastRecruitmentLog = 0;
  private _followerSources: { [key: string]: number } = { };
  private _followerDests: { [key: string]: number } = { };

  public max (state: GameState): number {
    let max = state.config.cfgStartingPlayerMax;
    max += state.getResource('tents').value * 2;
    max += state.getResource('house').value * 10;
    return max;
  }

  public inc (state: GameState): number {
    let inc = 0;

    // pastor recruiting
    const pastors = state.getResource('pstor').value;
    inc += pastors * state.config.cfgPastorRecruitRate;

    // credibility adjustment
    const creds = state.getResource('creds');
    if (creds.max !== null) inc *= creds.value / creds.max(state);

    return inc;
  }

  public clickAction (state: GameState): void {
    // don't exceed max
    if (this.value >= this.max(state)) {
      state.log('You have no room for more followers.');
      return;
    }

    // chance to fail increases as credibility decreases
    const creds = state.getResource('creds');
    if (creds.max !== null) {
      const ratio = Math.ceil(creds.value) / creds.max(state);
      if (Math.random() > ratio) {
        state.log('Your recruitment efforts failed.');
        return;
      }
    }

    this._lastRecruitmentLog = 0; // always log on click
    this.addValue(1, state);
  }

  public addValue (amount: number, state: GameState): void {
    const oldValue = this.value;
    this.value += amount;
    const diff = Math.floor(this.value) - Math.floor(oldValue);

    if (diff > 0) {
      // gained followers must come from other faiths
      for (let i = 0; i < diff; i++) {
        const source = this._getRandomReligion(state);
        source[1].addValue(-1, state);
        const curFollowers = this._followerSources[source[0]];
        this._followerSources[source[0]] = !isNaN(curFollowers)
          ? curFollowers + 1
          : 1;
      }
    } else {
      // lost followers must return to other faiths
      for (let i = 0; i < diff * -1; i++) {
        const dest = this._getRandomReligion(state);
        dest[1].addValue(1, state);
        const curFollowers = this._followerDests[dest[0]];
        this._followerDests[dest[0]] = !isNaN(curFollowers)
          ? curFollowers + 1
          : 1;
      }
    }
  }

  public isUnlocked (_state: GameState): boolean {
    return true;
  }

  public advanceAction (time: number, state: GameState): void {
    // chance to lose some followers every 10s if credibility < 100%
    this._timeSinceLastLost += time;
    if (this._timeSinceLastLost > 10000) {
      if (this.value > 0) {
        const creds = state.getResource('creds');
        if (creds.max !== null) {
          const ratio = Math.ceil(creds.value) / creds.max(state);
          if (Math.random() > ratio) {
            const lost = Math.ceil(this.value / 25 * (1 - ratio));
            this.addValue(lost * -1, state);
          }
        }
      }
      this._timeSinceLastLost = 0;
    }

    // log lost and gained followers every 10s
    if (state.now - this._lastRecruitmentLog > 10000
      && (Object.keys(this._followerSources).length > 0
        || Object.keys(this._followerDests).length > 0)) {
      if (Object.keys(this._followerDests).length > 0) {
        let msg = '';
        let total = 0;
        for (const rkey of Object.keys(this._followerDests)) {
          if (msg !== '') msg += ', ';
          const religion = state.getResource(rkey);
          msg += `${state.formatNumber(this._followerDests[rkey])} to ${religion.name}`;
          total += this._followerDests[rkey];
          delete this._followerDests[rkey];
        }
        state.log(`You lost ${state.formatNumber(total)} followers: ${msg}`);
      }
      if (Object.keys(this._followerSources).length > 0) {
        let msg = '';
        let total = 0;
        for (const rkey of Object.keys(this._followerSources)) {
          if (msg !== '') msg += ', ';
          const religion = state.getResource(rkey);
          msg +=
            `${state.formatNumber(this._followerSources[rkey])} from ${religion.name}`;
          total += this._followerSources[rkey];
          delete this._followerSources[rkey];
        }
        state.log(`You gained ${state.formatNumber(total)} followers: ${msg}`);
      }
      this._lastRecruitmentLog = state.now;
    }
  }

  private _getRandomReligion (state: GameState): [string, IResource] {
    const religs = ['xtian', 'islam', 'hindu',
      'buddh', 'sikhi', 'judah', 'other', 'agnos'];
    const source = religs[Math.floor(Math.random() * 8)];
    return [source, state.getResource(source)];
  }
}
