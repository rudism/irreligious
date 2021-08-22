/// <reference path="./IResource.ts" />

abstract class Job implements IResource {
  public readonly resourceType: ResourceType = ResourceType.Job;
  public value: number = 0;
  public readonly valueInWholeNumbers: boolean = true;

  public clickText: string = 'Hire';
  public clickDescription: string = 'Promote one of your followers.';

  public cost: { [key: string]: number } = { };

  protected _costMultiplier: { [key: string]: number } = { };
  protected _isUnlocked: boolean = false;

  constructor (
    public readonly name: string,
    public readonly description: string
  ) { }

  public clickAction (state: GameState): void {
    if (this._availableJobs(state) <= 0) {
      state.log('You have no unemployed followers to promote.');
      return;
    }
    if (this.value < this.max(state) && state.deductCost(this.cost)) {
      this.value++;
      state.log(this._hireLog(1, state));
      for (const rkey of Object.keys(this._costMultiplier)) {
        this.cost[rkey] *= this._costMultiplier[rkey];
      }
    }
  }

  public inc (state: GameState): number | null {
    return null;
  }

  public max (state: GameState): number | null {
    return null;
  }

  public advanceAction (time: number, state: GameState): void {
    return;
  }

  public isUnlocked (state: GameState): boolean {
    return this._isUnlocked;
  }

  protected _availableJobs (state: GameState): number {
    // number of followers minus the number of filled jobs
    const followers: number = state.getResource('plorg').value;
    const hired: number = state.getResources()
      .reduce((tot: number, rkey: string): number => {
        const res: IResource = state.getResource(rkey);
        return res.resourceType === ResourceType.Job
          ? tot + res.value
          : tot;
      }, 0);
    let max: number = followers - hired;
    if (max < 0) max = 0;
    return max;
  }

  protected _hireLog (amount: number, state: GameState): string {
    return `You hired ${amount} x ${this.name}.`;
  }
}
