/// <reference path="../model/GameState.ts" />
/// <reference path="./IRenderer.ts" />

class DebugRenderer implements IRenderer {
  private _initialized = false;
  private _handleClick = true;

  public render (state: GameState) {
    const container = document.getElementById('irreligious-game');
    if (container === null) {
      console.log('Cannot find #irreligious-game container.'); // tslint:disable-line
    } else {
      if (!this._initialized) {
        this._initialized = true;
        state.onResourceClick.push(() => this._handleClick = true);
        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', 'css/debugger.css');
        const head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
      }
      const rkeys = state.getResources();
      for (const rkey of rkeys) {
        const resource = state.getResource(rkey);
        if (resource.isUnlocked(state)) {
          let el = document.getElementById(`r_${rkey}`);
          if (el === null) {
            el = document.createElement('div');
            el.className = 'resource';
            el.id = `r_${rkey}`;
            let content = `
              <span class='resourceTitle' title='${resource.description}'>${resource.name}</span><br>
              <span class='value'></span><span class='max'></span><span class='inc'></span>
            `;
            if (resource.clickText !== null) {
              content += `<br><button class='btn' title='${resource.clickDescription}'>${resource.clickText}</button>`;
            }
            if (resource.cost !== null && Object.keys(resource.cost) !== null) {
              content += `<br>Cost: <span class='cost'></span>`;
            }
            el.innerHTML = content;
            container.appendChild(el);
            if (resource.clickAction !== null) {
              const btn = el.getElementsByClassName('btn')[0];
              btn.addEventListener('click', () => state.performClick(rkey));
            }
          }
          const elV = el.getElementsByClassName('value')[0];
          const elT = el.getElementsByClassName('max')[0];
          elV.innerHTML = this.formatNumber(resource.value, 1);
          elT.innerHTML = resource.max !== null ? ` / ${this.formatNumber(resource.max, 2)}` : '';
          if (this._handleClick) {
            const elC = el.getElementsByClassName('cost');
            if (elC.length > 0) {
              elC[0].innerHTML = this.getCostStr(resource, state);
            }
          }
        }
      }
      this._handleClick = false;
    }
  }

  private getCostStr (resource: IResource, state: GameState) {
    let cost = '';
    for (const rkey of state.getResources()) {
      if (resource.cost[rkey] !== undefined) {
        if (cost !== '') cost += ', ';
        if (rkey === 'money') {
          cost += `$${this.formatNumber(resource.cost[rkey], 1)}`;
        } else {
          cost += `${this.formatNumber(resource.cost[rkey], 1)} ${state.getResource(rkey).name}`;
        }
      }
    }
    return cost;
  }

  private formatNumber (num: number, digits: number): string {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup.slice().reverse().find((i) => num >= i.value);
    return item
      ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
      : "0";
  }
}
