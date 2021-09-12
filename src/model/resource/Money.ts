/// <reference path="./Resource.ts" />

class Money extends Resource {
  public readonly resourceType = ResourceType.purchasable;
  public readonly resourceKey = ResourceKey.money;

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

  public constructor(initialValue: number) {
    super();
    this.rawValue = initialValue;
  }

  public isUnlocked = (_: GameState): boolean => true;

  public max = (state: GameState): number => {
    let max = state.config.cfgInitialMax.money ?? 0;
    max +=
      (state.resource.compounds?.value ?? 0) *
      (state.config.cfgCapacity.compounds?.money ?? 0);
    return max;
  };

  public inc = (state: GameState): number => {
    let inc = 0;

    // tithings
    inc +=
      ((state.resource.pastors?.value ?? 0) *
        (state.resource.followers?.value ?? 0) *
        (state.config.cfgTitheAmount ?? 0) *
        Credibility.ratio(state)) /
      state.config.cfgTimeBetweenTithes;

    // salaries
    inc -=
      (state.resource.compoundManagers?.value ?? 0) *
      (state.config.cfgSalary.compoundManagers ?? 0);

    return inc;
  };

  protected _collectTithes(state: GameState): void {
    if (this.value >= this.max(state)) return;

    // can't tithe your pastors
    const followers =
      (state.resource.followers?.value ?? 0) -
      (state.resource.pastors?.value ?? 0);

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
          followers.value
        )} ${
          followers.value > 1 ? followers.pluralName : followers.singularName
        }.`
      );
    } else {
      state.log(`You collected $${formatNumber(amount)} in tithings.`);
    }
  }
}
