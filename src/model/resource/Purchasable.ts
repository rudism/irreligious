/// <reference path="./IResource.ts" />

abstract class Purchasable implements IResource {
  public readonly resourceType: ResourceType = ResourceType.consumable;
  public valueInWholeNumbers = true;
  public value = 0;
  public readonly cost: ResourceNumber = { };

  public inc?: (state: GameState) => number = undefined;
  public max?: (_state: GameState) => number = undefined;

  public userActions: ResourceAction[] = [
    {
      name: this._purchaseButtonText,
      description: this._purchaseDescription,
      isEnabled: (state: GameState): boolean =>
        (this.max === undefined || this.value < this.max(state))
        && state.isPurchasable(this.cost),
      performAction: (state: GameState): void => {
        this._purchase(state);
      },
    },
  ];

  protected _costMultiplier: ResourceNumber = { };
  protected _isUnlocked = false;

  constructor (
    public readonly singularName: string,
    public readonly pluralName: string,
    public readonly description: string,
    private readonly _purchaseButtonText: string = 'Purchase',
    private readonly _purchaseDescription: string = `Buy a ${singularName}.`,
  ) { }

  public addValue (amount: number, _state: GameState): void {
    this.value += amount;
  }

  public isUnlocked (state: GameState): boolean {
    if (!this._isUnlocked && state.isPurchasable(this.cost)) {
      this._isUnlocked = true;
    }
    return this._isUnlocked;
  }

  public advanceAction (_time: number, _state: GameState): void {
    return;
  }

  protected _purchaseAmount (_state: GameState): number {
    return 1;
  }

  protected _purchaseLog (amount: number, _state: GameState): string {
    return `You purchased ${amount} ${amount > 1 ? this.pluralName : this.singularName}.`;
  }

  private _purchase (state: GameState): void {
    if (this.max !== undefined && this.value >= this.max(state)) return;
    if (state.deductCost(this.cost)) {
      const amount = this._purchaseAmount(state);
      if (amount > 0) {
        this.value += amount;
        state.log(this._purchaseLog(amount, state));
        for (const key in this._costMultiplier) {
          const rkey = <ResourceKey>key;
          this.cost[rkey] =
            (this.cost[rkey] ?? 0) * (this._costMultiplier[rkey] ?? 1);
        }
      }
    }
  }
}
