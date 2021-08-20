/// <reference path="./Consumable.ts" />

class Money extends Consumable {
  constructor (
    public value: number,
    public max: number
  ) {
    super('Money', 'Used to purchase goods and services.',
      value, true, max);
  }
}
