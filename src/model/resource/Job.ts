/// <reference path="./IResource.ts" />

abstract class Job implements IResource {
  public readonly resourceType = ResourceType.job;
  public readonly valueInWholeNumbers = true;
  public value = 0;
  public readonly cost: ResourceNumber = { };

  public max?: (state: GameState) => number = undefined;
  public inc?: (state: GameState) => number = undefined;

  public userActions: ResourceAction[] = [
    {
      name: 'Hire',
      description: 'Promote one of your followers.',
      isEnabled: (state: GameState): boolean =>
        (this.max === undefined || this.value < this.max(state))
        && this.value < this._availableJobs(state),
      performAction: (state: GameState): void => {
        this._promoteFollower(state);
      },
    },
  ];

  protected _costMultiplier: { [key in ResourceKey]?: number } = { };
  protected _isUnlocked = false;

  constructor (
    public readonly singularName: string,
    public readonly pluralName: string,
    public readonly description: string
  ) { }

  public addValue (amount: number): void {
    this.value += amount;
    if (this.value < 0) this.value = 0;
  }

  public isUnlocked (_state: GameState): boolean {
    return this._isUnlocked;
  }

  public advanceAction (_time: number, state: GameState): void {
    // if we're out of followers then the jobs also vacate
    const avail = this._availableJobs(state);
    if (avail < 0 && this.value > 0) {
      this.addValue(avail);
    }
    return;
  }

  protected _availableJobs (state: GameState): number {
    // number of followers minus the number of filled jobs
    const followers = state.resource.playerOrg?.value ?? 0;
    const hired = state.resources.reduce(
      (tot: number, rkey: ResourceKey): number => {
        const res = state.resource[rkey];
        return res?.resourceType === ResourceType.job
          ? tot + res.value
          : tot;
      }, 0);
    return followers - hired;
  }

  protected _totalPayroll (state: GameState): number {
    // number of followers minus the number of filled jobs
    const followers = state.resource.playerOrg?.value ?? 0;
    const hired = state.resources.reduce(
      (tot: number, rkey: ResourceKey): number => {
        const res = state.resource[rkey];
        return res?.resourceType === ResourceType.job
          ? tot + res.value
          : tot;
      }, 0);
    return followers - hired;
  }

  protected _hireLog (amount: number, _state: GameState): string {
    return `You hired ${amount} x ${this.pluralName}.`;
  }

  private _promoteFollower (state: GameState): void {
    if (this._availableJobs(state) <= 0) {
      state.log('You have no unemployed followers to promote.');
      return;
    }
    if (this.max !== undefined && this.value < this.max(state)
      && state.deductCost(this.cost)) {
      this.addValue(1);
      state.log(this._hireLog(1, state));
      for (const key in this._costMultiplier) {
        const rkey = <ResourceKey>key;
        this.cost[rkey] =
          (this.cost[rkey] ?? 0) * (this._costMultiplier[rkey] ?? 1);
      }
    }
  }
}
