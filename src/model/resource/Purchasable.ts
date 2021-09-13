/// <reference path="./Resource.ts" />

abstract class Purchasable extends Resource {
  public readonly resourceType: ResourceType = ResourceType.purchasable;

  public valueInWholeNumbers = true;

  public max?: (state: GameState) => number = undefined;
  public inc?: (state: GameState) => ResourceNumber = undefined;

  public userActions: ResourceAction[] = [
    {
      name: this._purchaseButtonText,
      description: this._purchaseDescription,
      isEnabled: (state: GameState): boolean =>
        (this.max === undefined || this.value < this.max(state)) &&
        state.isPurchasable(this.cost(state)),
      performAction: (state: GameState): void => {
        this._purchase(state);
      },
    },
  ];

  protected readonly _baseCost: ResourceNumber = {};
  protected readonly _costMultiplier: ResourceNumber = {};
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
    super();
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

  public cost = (_: GameState): ResourceNumber => {
    if (this.value <= 0) return this._baseCost;

    const actualCost: ResourceNumber = {};
    for (const key in this._baseCost) {
      const rkey = <ResourceKey>key;
      const baseCost = this._baseCost[rkey] ?? 0;
      const multiplier = this._costMultiplier[rkey] ?? 1;
      actualCost[rkey] = baseCost * Math.pow(multiplier, this.value);
    }
    return actualCost;
  };

  public isUnlocked = (state: GameState): boolean => {
    if (!this._isUnlocked && state.isPurchasable(this.cost(state))) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  };

  public emitConfig = (): ResourceConfigValues => {
    return { isUnlocked: this._isUnlocked };
  };

  public restoreConfig = (config: ResourceConfig): void => {
    this.rawValue = config.value;
    if (
      config.config !== undefined &&
      typeof config.config.isUnlocked === 'boolean'
    ) {
      this._isUnlocked = config.config.isUnlocked;
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
    if (state.deductCost(this.cost(state))) {
      this.addValue(1, state);
      state.log(this._purchaseLog(1, state));
    }
  }

  private _sell(state: GameState): void {
    if (this.value <= 0) return;

    this.addValue(-1, state);
    state.log(this._purchaseLog(-1, state));

    const costBack: ResourceNumber = {};
    for (const key in this.cost(state)) {
      const rkey = <ResourceKey>key;
      const cost = this.cost(state)[rkey];
      if (cost === undefined) continue;
      costBack[rkey] = cost * state.config.cfgSellCostBackMultiplier * -1;
    }
    state.deductCost(costBack);
  }
}
