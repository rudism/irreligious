/// <reference path="./IResource.ts" />

class Follower implements IResource {
  public readonly resourceType = ResourceType.religion;
  public readonly singularName = 'follower';
  public readonly pluralName = 'followers';
  public readonly description = 'In you they trust.';
  public readonly valueInWholeNumbers = true;
  public value = 0;

  public userActions: ResourceAction[] = [
    {
      name: 'Recruit',
      description: 'Gather new followers.',
      isEnabled: (state: GameState): boolean => this.value < this.max(state),
      performAction: (state: GameState): void => {
        this._recruitFollower(state);
      },
    },
  ];

  private _timeSinceLastLost = 0;
  private _lastRecruitmentLog = 0;
  private _followerSources: ResourceNumber = { };
  private _followerDests: ResourceNumber = { };

  public max (state: GameState): number {
    let max = state.config.cfgInitialMax.followers ?? 0;
    max += (state.resource.tents?.value ?? 0)
      * (state.config.cfgCapacity.tents?.followers ?? 0);
    max += (state.resource.houses?.value ?? 0)
      * (state.config.cfgCapacity.houses?.followers ?? 0);
    return max;
  }

  public inc (state: GameState): number {
    let inc = 0;

    // pastor recruiting
    const pastors = state.resource.pastors?.value ?? 0;
    inc += pastors * state.config.cfgPastorRecruitRate;

    // credibility adjustment
    const creds = state.resource.credibility;
    if (creds?.max !== undefined) inc *= creds.value / creds.max(state);

    return inc;
  }

  public addValue (amount: number, state: GameState): void {
    const oldValue = this.value;
    this.value += amount;
    const diff = Math.floor(this.value) - Math.floor(oldValue);

    if (diff > 0) {
      // gained followers must come from other faiths
      for (let i = 0; i < diff; i++) {
        const source = this._getRandomReligion(state);
        if (source !== null) {
          source[1].addValue(-1, state);
          const curFollowers = this._followerSources[source[0]] ?? 0;
          this._followerSources[source[0]] = curFollowers + 1;
        }
      }
    } else {
      // lost followers must return to other faiths
      for (let i = 0; i < diff * -1; i++) {
        const dest = this._getRandomReligion(state);
        if (dest !== null) {
          dest[1].addValue(1, state);
          const curFollowers = this._followerDests[dest[0]] ?? 0;
          this._followerDests[dest[0]] = curFollowers + 1;
        }
      }
    }
  }

  public isUnlocked (_state: GameState): boolean {
    return true;
  }

  public advanceAction (time: number, state: GameState): void {
    // chance to lose some followers every 10s if credibility < 100%
    this._timeSinceLastLost += time;
    if (this._timeSinceLastLost > state.config.cfgCredibilityFollowerLossTime) {
      if (this.value > 0) {
        const creds = state.resource.credibility;
        if (creds?.max !== undefined) {
          const ratio =
            Math.ceil(creds.value) / creds.max(state);
          if (Math.random() > ratio) {
            const lost = Math.ceil(this.value
              * state.config.cfgCredibilityFollowerLossRatio
              * (1 - ratio));
            this.addValue(lost * -1, state);
          }
        }
      }
      this._timeSinceLastLost = 0;
    }

    // log lost and gained followers every 10s
    if (state.now
          - this._lastRecruitmentLog > state.config.cfgFollowerGainLossLogTimer
      && (Object.keys(this._followerSources).length > 0
        || Object.keys(this._followerDests).length > 0)) {
      if (Object.keys(this._followerDests).length > 0) {
        let msg = '';
        let total = 0;
        for (const key in this._followerDests) {
          const rkey = <ResourceKey>key;
          const religion = state.resource[rkey];
          const followers = this._followerDests[rkey];
          if (religion !== undefined && followers !== undefined) {
            if (msg !== '') msg += ', ';
            msg += `${formatNumber(followers)} ${followers > 1 ? religion.pluralName : religion.singularName}`;
            total += followers;
            delete this._followerDests[rkey];
          }
        }
        state.log(`You lost ${formatNumber(total)} ${total > 1 ? this.pluralName : this.singularName}: ${msg}`);
      }
      if (Object.keys(this._followerSources).length > 0) {
        let msg = '';
        let total = 0;
        for (const key in this._followerSources) {
          const rkey = <ResourceKey>key;
          const religion = state.resource[rkey];
          const followers = this._followerSources[rkey];
          if (religion !== undefined && followers !== undefined) {
            if (msg !== '') msg += ', ';
            msg +=
              `${formatNumber(followers)} ${followers > 1 ? religion.pluralName : religion.singularName}`;
            total += followers;
            delete this._followerSources[rkey];
          }
        }
        state.log(`You gained ${formatNumber(total)} ${total > 1 ? this.pluralName : this.singularName}: ${msg}`);
      }
      this._lastRecruitmentLog = state.now;
    }
  }

  private _recruitFollower (state: GameState): void {
    // don't exceed max
    if (this.value >= this.max(state)) {
      state.log('You have no room for more followers.');
      return;
    }

    // chance to fail increases as credibility decreases
    const creds = state.resource.credibility;
    if (creds?.max !== undefined) {
      const ratio = Math.ceil(creds.value) / creds.max(state);
      if (Math.random() > ratio) {
        state.log('Your recruitment efforts failed.');
        return;
      }
    }

    this._lastRecruitmentLog = 0; // always log on click
    this.addValue(1, state);
  }

  private _getRandomReligion (
    state: GameState): [ResourceKey, IResource] | null {
    const religs = [ResourceKey.christianity, ResourceKey.islam,
      ResourceKey.hinduism, ResourceKey.buddhism, ResourceKey.sikhism,
      ResourceKey.judaism, ResourceKey.other, ResourceKey.atheism];
    const source = religs[Math.floor(Math.random() * 8)];
    const resource = state.resource[source];
    return resource !== undefined ? [source, resource] : null;
  }
}
