/// <reference path="../model/GameState.ts" />
/// <reference path="./IRenderer.ts" />

class DebugRenderer implements IRenderer {
  private _initialized = false;
  private _handleClick = true;

  public render (state: GameState) {
    if (!this._initialized) {
      const container = document.getElementById('irreligious-game');
      this._initialized = true;
      state.onResourceClick.push(() => this._handleClick = true);
      const style = document.createElement('link');
      style.setAttribute('rel', 'stylesheet');
      style.setAttribute('href', 'css/debugger.css');
      const head = document.getElementsByTagName('head')[0];
      head.appendChild(style);
      // create containers for each resource type
      for (const item in ResourceType) {
        if (isNaN(Number(item))) {
          const el = document.createElement('div');
          el.id = `resource-container-${ResourceType[item]}`;
          el.className = 'resource-type-container';
          container.appendChild(el);
        }
      }
    }
    const rkeys = state.getResources();
    for (const rkey of rkeys) {
      const resource = state.getResource(rkey);
      console.log(`getting container resource-container-${resource.resourceType}`); // tslint:disable-line
      const container = document.getElementById(`resource-container-${resource.resourceType}`);
      if (resource.isUnlocked(state)) {
        let el = document.getElementById(`resource-details-${rkey}`);
        if (el === null) {
          el = document.createElement('div');
          el.className = 'resource';
          el.id = `resource-details-${rkey}`;
          let content = `
            <span class='resource-title' title='${resource.description}'>${resource.name}</span><br>
            <span class='resource-value'></span><span class='resource-max'></span><span class='resource-inc'></span>
          `;
          if (resource.clickText !== null) {
            content += `<br><button class='resource-btn' title='${resource.clickDescription}'>${resource.clickText}</button>`;
          }
          if (resource.cost !== null && Object.keys(resource.cost) !== null) {
            content += `<br>Cost: <span class='resource-cost'></span>`;
          }
          el.innerHTML = content;
          container.appendChild(el);
          if (resource.clickAction !== null) {
            const btn = el.getElementsByClassName('resource-btn')[0];
            btn.addEventListener('click', () => state.performClick(rkey));
          }
        }
        const elV = el.getElementsByClassName('resource-value')[0];
        const elT = el.getElementsByClassName('resource-max')[0];
        elV.innerHTML = this.formatNumber(resource.value, 1);
        elT.innerHTML = resource.max !== null ? ` / ${this.formatNumber(resource.max, 1)}` : '';
        if (this._handleClick) {
          if (resource.inc > 0) {
            const elI = el.getElementsByClassName('resource-inc')[0];
            elI.innerHTML = ` +${this.formatNumber(resource.inc, 1)}/s`;
          }
          const elC = el.getElementsByClassName('resource-cost');
          if (elC.length > 0) {
            elC[0].innerHTML = this.getCostStr(resource, state);
          }
        }
      }
    }
    this._handleClick = false;
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
      { value: 1e3, symbol: "K" },
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
      : num.toFixed(digits).replace(rx, "$1");
  }
}
