/// <reference path="./IResource.ts" />

abstract class Job implements IResource {
  public readonly resourceType = ResourceType.job;
  public readonly valueInWholeNumbers = true;
  public readonly clickText = 'Hire';
  public readonly clickDescription = 'Promote one of your followers.';
  public value = 0;
  public readonly cost: { [key: string]: number } = { };

  public max: ((state: GameState) => number) | null = null;
  public inc: ((state: GameState) => number) | null = null;

  protected _costMultiplier: { [key: string]: number } = { };
  protected _isUnlocked = false;

  constructor (
    public readonly name: string,
    public readonly description: string
  ) { }


  public clickAction (state: GameState): void {
    if (this._availableJobs(state) <= 0) {
      state.log('You have no unemployed followers to promote.');
      return;
    }
    if (this.max !== null && this.value < this.max(state)
      && state.deductCost(this.cost)) {
      this.addValue(1);
      state.log(this._hireLog(1, state));
      for (const rkey of Object.keys(this._costMultiplier)) {
        this.cost[rkey] *= this._costMultiplier[rkey];
      }
    }
  }

  public addValue (amount: number): void {
    this.value += amount;
  }

  public isUnlocked (_state: GameState): boolean {
    return this._isUnlocked;
  }

  public advanceAction (_time: number, _state: GameState): void {
    return;
  }

  protected _availableJobs (state: GameState): number {
    // number of followers minus the number of filled jobs
    const followers = state.getResource('plorg').value;
    const hired = state.getResources().reduce(
      (tot: number, rkey: string): number => {
        const res = state.getResource(rkey);
        return res.resourceType === ResourceType.job
          ? tot + res.value
          : tot;
      }, 0);
    let max = followers - hired;
    if (max < 0) max = 0;
    return max;
  }

  protected _hireLog (amount: number, _state: GameState): string {
    return `You hired ${amount} x ${this.name}.`;
  }
}
