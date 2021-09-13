/// <reference path="./Resource.ts" />
/// <reference path="./Job.ts" />

class Follower extends Resource {
  public readonly resourceType = ResourceType.religion;
  public readonly resourceKey = ResourceKey.followers;

  public readonly label = 'Your Followers';
  public readonly singularName = 'follower';
  public readonly pluralName = 'followers';
  public readonly description = 'In you they trust.';
  public readonly valueInWholeNumbers = true;

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

  private _lastRecruitmentLog = 0;
  private _followerSources: ResourceNumber = {};
  private _followerDests: ResourceNumber = {};
  private _timeSinceLastQuit = 0;
  private _quitTracker: ResourceNumber = {};

  public max = (state: GameState): number => {
    let max = state.config.cfgInitialMax.followers ?? 0;
    max +=
      (state.resource.tents?.value ?? 0) *
      (state.config.cfgCapacity.tents?.followers ?? 0);
    max +=
      (state.resource.houses?.value ?? 0) *
      (state.config.cfgCapacity.houses?.followers ?? 0);
    return max;
  };

  public inc = (state: GameState): ResourceNumber => {
    const inc: ResourceNumber = {};

    // pastor recruiting
    const pastors =
      (state.resource.pastors?.value ?? 0) * state.config.cfgPastorRecruitRate;

    if (pastors > 0) inc.pastors = pastors;

    // credibility adjustment
    // this should be based on notoriety instead
    /*const creds = state.resource.credibility;
    if (creds?.max !== undefined) inc *= creds.value / creds.max(state);*/

    return inc;
  };

  public addValue = (amount: number, state: GameState): void => {
    const oldValue = this.value;
    this.rawValue += amount;
    const diff = this.value - oldValue;

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
  };

  public isUnlocked = (): boolean => true;

  public advanceAction = (time: number, state: GameState): void => {
    // chance for some followers to quit their jobs if money === 0
    const money = state.resource.money;
    const totalJobs = Job.totalJobs(state);
    if (money !== undefined && money.value <= 0 && totalJobs > 0) {
      this._timeSinceLastQuit += time;
      if (this._timeSinceLastQuit > state.config.cfgNoMoneyQuitTime) {
        let lost = Math.ceil(totalJobs * state.config.cfgNoMoneyQuitRate);
        for (const rkey of Job.jobResources(state)) {
          const job = state.resource[rkey];
          if (job !== undefined && job.value > 0) {
            if (job.value >= lost) {
              job.addValue(lost * -1, state);
              this._quitTracker[rkey] = lost;
              break;
            } else {
              job.addValue(job.value * -1, state);
              this._quitTracker[rkey] = job.value;
              lost -= job.value;
            }
          }
        }
        this._timeSinceLastQuit = 0;
      }
    } else {
      this._timeSinceLastQuit = 0;
    }

    // log lost, gained, and quit followers at regular intervals
    if (
      state.now - this._lastRecruitmentLog >
        state.config.cfgFollowerGainLossLogTimer &&
      (Object.keys(this._followerSources).length > 0 ||
        Object.keys(this._followerDests).length > 0 ||
        Object.keys(this._quitTracker).length > 0)
    ) {
      if (Object.keys(this._followerDests).length > 0) {
        let msg = '';
        let total = 0;
        for (const key in this._followerDests) {
          const rkey = <ResourceKey>key;
          const religion = state.resource[rkey];
          const followers = this._followerDests[rkey];
          if (religion !== undefined && followers !== undefined) {
            if (msg !== '') msg += ', ';
            msg += `${formatNumber(followers)} became ${
              followers > 1 ? religion.pluralName : 'a ' + religion.singularName
            }`;
            total += followers;
            delete this._followerDests[rkey];
          }
        }
        state.log(
          `You lost ${formatNumber(total)} ${
            total > 1 ? this.pluralName : this.singularName
          }: ${msg}`
        );
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
            msg += `${formatNumber(followers)} ${
              followers > 1 ? religion.pluralName : religion.singularName
            }`;
            total += followers;
            delete this._followerSources[rkey];
          }
        }
        state.log(
          `You gained ${formatNumber(total)} ${
            total > 1 ? this.pluralName : this.singularName
          }: ${msg}`
        );
      }
      if (Object.keys(this._quitTracker).length > 0) {
        let msg = '';
        let total = 0;
        for (const key in this._quitTracker) {
          const rkey = <ResourceKey>key;
          const job = state.resource[rkey];
          const followers = this._quitTracker[rkey];
          if (job !== undefined && followers !== undefined) {
            if (msg !== '') msg += ', ';
            msg += `${formatNumber(followers)} ${
              followers > 1 ? job.pluralName : job.singularName
            }`;
            total += followers;
            delete this._quitTracker[rkey];
          }
        }
        state.log(
          `${formatNumber(total)} ${
            total > 1 ? this.pluralName : this.singularName
          } quit their jobs: ${msg}`
        );
      }
      this._lastRecruitmentLog = state.now;
    }
  };

  private _recruitFollower(state: GameState): void {
    // don't exceed max
    if (this.value >= this.max(state)) {
      state.log('You have no room for more followers.');
      return;
    }

    // chance to fail increases as credibility decreases
    // this should be based on notoriety instead
    /*const creds = state.resource.credibility;
    if (creds?.max !== undefined) {
      const ratio = Math.ceil(creds.value) / creds.max(state);
      if (Math.random() > ratio) {
        state.log('Your recruitment efforts failed.');
        return;
      }
    }*/

    this._lastRecruitmentLog = 0; // always log on click
    this.addValue(1, state);
  }

  private _getRandomReligion(
    state: GameState
  ): [ResourceKey, IResource] | null {
    const religs = [
      ResourceKey.christianity,
      ResourceKey.islam,
      ResourceKey.hinduism,
      ResourceKey.buddhism,
      ResourceKey.sikhism,
      ResourceKey.judaism,
      ResourceKey.other,
      ResourceKey.atheism,
    ];
    const source = religs[Math.floor(Math.random() * 8)];
    const resource = state.resource[source];
    return resource !== undefined ? [source, resource] : null;
  }
}
