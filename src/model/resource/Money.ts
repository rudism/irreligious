/// <reference path="./Purchasable.ts" />

class Money implements IResource {
  public readonly resourceType = ResourceType.consumable;
  public readonly label = 'Money';
  public readonly singularName = '${}';
  public readonly pluralName = '${}';
  public readonly description = 'Used to purchase goods and services.';
  public readonly valueInWholeNumbers = false;

  public userActions: ResourceAction[] = [
    {
      name: 'Collect Tithes',
      description: 'Voluntary contributions from followers.',
      isEnabled: (state: GameState): boolean =>
        this.value < this.max(state) &&
        (state.resource.followers?.value ?? 0) >= 1,
      performAction: (state: GameState): void => {
        this._collectTithes(state);
      },
    },
  ];

  private _lastCollectionTime = 0;

  constructor(public value: number) {}

  public isUnlocked = (_state: GameState): boolean => true;

  public addValue(amount: number, _state: GameState): void {
    this.value += amount;
  }

  public max: (state: GameState) => number = (state: GameState) => {
    let max = state.config.cfgInitialMax.money ?? 0;
    max +=
      (state.resource.compounds?.value ?? 0) *
      (state.config.cfgCapacity.compounds?.money ?? 0);
    return max;
  };

  public inc: (state: GameState) => number = (state) => {
    let inc = 0;

    // salaries
    inc -=
      (state.resource.pastors?.value ?? 0) *
      (state.config.cfgSalary.pastors ?? 0);

    inc -=
      (state.resource.compoundManagers?.value ?? 0) *
      (state.config.cfgSalary.compoundManagers ?? 0);

    return inc;
  };

  protected _collectTithes(state: GameState): void {
    if (this.value >= this.max(state)) return;

    const followers = state.resource.followers?.value ?? 0;
    if (followers <= 0) return;

    // collecting too frequently hurts credibility
    const diff = state.now - this._lastCollectionTime;
    if (diff < state.config.cfgTimeBetweenTithes) {
      const lost =
        state.config.cfgTimeBetweenTithes /
        diff /
        state.config.cfgTitheCredibilityHitFactor;
      state.resource.credibility?.addValue(lost * -1, state);
    }

    const tithings = followers * state.config.cfgTitheAmount;
    this._lastCollectionTime = state.now;

    if (tithings > 0) {
      this.addValue(tithings, state);
      this._purchaseLog(tithings, state);
    }
  }

  protected _purchaseLog(amount: number, state: GameState): void {
    const followers = state.resource.followers;
    if (followers !== undefined) {
      state.log(
        `You collected $${formatNumber(amount)} from ${formatNumber(
          Math.floor(followers.value)
        )} ${
          Math.floor(followers.value) > 1
            ? followers.pluralName
            : followers.singularName
        }.`
      );
    } else {
      state.log(`You collected $${formatNumber(amount)} in tithings.`);
    }
  }
}
