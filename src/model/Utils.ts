/// <reference path="./resource/SharedTypes.ts" />

const numberFormatDigits = 1;

function formatNumber(num: number): string {
  type UnitLookup = { value: number; symbol: string };
  const lookup: UnitLookup[] = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let item: UnitLookup | undefined;
  for (item of lookup.slice().reverse()) {
    if (Math.abs(num) >= item.value) break;
  }
  const sign = num < 0 ? '-' : '';
  const number =
    item !== undefined
      ? (Math.abs(num) / item.value)
          .toFixed(numberFormatDigits)
          .replace(rx, '$1') + item.symbol
      : Math.abs(num).toFixed(numberFormatDigits).replace(rx, '$1');

  return `${sign}${number}`;
}

function resourceNumberSum(res: ResourceNumber): number {
  let sum = 0;
  for (const key in res) {
    const rkey = <ResourceKey>key;
    sum += res[rkey] ?? 0;
  }
  return sum;
}
