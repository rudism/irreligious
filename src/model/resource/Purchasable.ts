/// <reference path="./IResource.ts" />

abstract class Purchasable implements IResource {
  public readonly resourceType: ResourceType = ResourceType.consumable;
  public valueInWholeNumbers = true;
  public value = 0;
  public readonly cost: ResourceNumber = {};

  public inc?: (state: GameState) => number = undefined;
  public max?: (_state: GameState) => number = undefined;

  public userActions: ResourceAction[] = [
    {
      name: this._purchaseButtonText,
      description: this._purchaseDescription,
      isEnabled: (state: GameState): boolean =>
        (this.max === undefined || this.value < this.max(state)) &&
        state.isPurchasable(this.cost),
      performAction: (state: GameState): void => {
        this._purchase(state);
      },
    },
  ];

  protected _costMultiplier: ResourceNumber = {};
  protected _sellMultiplier?: number | ResourceNumber;
  protected _isUnlocked = false;

  constructor(
    public readonly label: string,
    public readonly singularName: string,
    public readonly pluralName: string,
    public readonly description: string,
    canSell = false,
    private readonly _purchaseButtonText = 'Purchase',
    private readonly _purchaseDescription = `Buy a ${singularName}.`,
    private readonly _sellButtonText = 'Sell',
    private readonly _sellDescription = `Sell a ${singularName}.`
  ) {
    if (canSell) {
      this.userActions.push({
        name: this._sellButtonText,
        description: this._sellDescription,
        isEnabled: (_state: GameState): boolean => this.value > 0,
        performAction: (state: GameState): void => {
          this._sell(state);
        },
      });
    }
  }

  public addValue(amount: number, _state: GameState): void {
    this.value += amount;
  }

  public isUnlocked(state: GameState): boolean {
    if (!this._isUnlocked && state.isPurchasable(this.cost)) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  }

  public advanceAction(_time: number, _state: GameState): void {
    return;
  }

  public emitConfig: () => ResourceConfigValues = () => {
    return { isUnlocked: this._isUnlocked };
  };

  public restoreConfig: (config: ResourceConfigValues) => void = (config) => {
    if (typeof config.isUnlocked === 'boolean') {
      this._isUnlocked = config.isUnlocked;
    }
  };

  protected _purchaseLog(amount: number, _state: GameState): string {
    let verb = 'purchased';
    if (amount < 0) {
      verb = 'sold';
      amount *= -1;
    }
    return `You ${verb} ${amount} ${
      amount > 1 ? this.pluralName : this.singularName
    }.`;
  }

  private _purchase(state: GameState): void {
    if (this.max !== undefined && this.value >= this.max(state)) return;
    if (state.deductCost(this.cost)) {
      this.value += 1;
      state.log(this._purchaseLog(1, state));
      for (const key in this._costMultiplier) {
        const rkey = <ResourceKey>key;
        this.cost[rkey] =
          (this.cost[rkey] ?? 0) * (this._costMultiplier[rkey] ?? 1);
      }
    }
  }

  private _sell(state: GameState): void {
    if (this.value <= 0) return;
    const costBack: ResourceNumber = {};
    for (const key in this.cost) {
      const rkey = <ResourceKey>key;
      let cost = this.cost[rkey];
      if (cost === undefined) continue;
      // revert cost multiplier
      cost /= this._costMultiplier[rkey] ?? 1;
      this.cost[rkey] = cost;
      const multiplier =
        this._sellMultiplier === undefined
          ? state.config.cfgDefaultSellMultiplier
          : typeof this._sellMultiplier === 'number'
          ? this._sellMultiplier
          : this._sellMultiplier[rkey] ?? state.config.cfgDefaultSellMultiplier;
      // penalize return on used item
      costBack[rkey] = cost * -1 * multiplier;
      state.deductCost(costBack);
    }
    this.value -= 1;
    state.log(this._purchaseLog(-1, state));
  }
}
