/// <reference path="./Infrastructure.ts" />

class Church extends Infrastructure {
  constructor () {
    super('Churches',
      'Preaching grounds for 2 pastors.');
    this.cost.money = 10000;
    this._costMultiplier.money = 1.01;
    this._baseMax = 2;
  }
}
