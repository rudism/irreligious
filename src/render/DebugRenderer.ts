/// <reference path="../model/logging/DebugLogger.ts" />

class DebugRenderer implements IRenderer {
  private _initialized = false;
  private _handleClick = true;

  public render (state: GameState): void {
    const rkeys = state.resources;
    const container = document.getElementById('irreligious-game');
    if (!this._initialized) {
      if (container === null) {
        console.error('could not find game container');
        return;
      }
      this._initialized = true;
      state.onResourceClick.push((): void => {
        this._handleClick = true;
      });
      const style = document.createElement('link');
      style.setAttribute('rel', 'stylesheet');
      style.setAttribute('href', 'css/debugger.css');
      const head = document.getElementsByTagName('head')[0];
      head.appendChild(style);
      // create resource area and logging area
      const resDiv = document.createElement('div');
      resDiv.id = 'resource-section';
      container.appendChild(resDiv);
      const logDiv = document.createElement('div');
      logDiv.id = 'logging-section';
      container.appendChild(logDiv);
      const logContent = document.createElement('div');
      logDiv.appendChild(logContent);
      state.logger = new DebugLogger(logContent);
      // create containers for each resource type
      for (const item in ResourceType) {
        if (isNaN(Number(item))) {
          const el = document.createElement('div');
          el.id = `resource-container-${item.toString()}`;
          el.className = 'resource-type-container';
          resDiv.appendChild(el);
        }
      }
      // create containers for each resource
      for (const rkey of rkeys) {
        const resource = state.resource[rkey];
        if (resource === undefined) continue;
        const resContainer = document.getElementById(
          `resource-container-${resource.resourceType}`);
        if (resContainer === null) continue;
        const el = document.createElement('div');
        el.className = 'resource locked';
        el.id = `resource-details-${rkey}`;
        let content = `
          <span class='resource-title'
            title='${this._escape(resource.description)}'>
            ${this._escape(resource.name)}</span><br>
          <span class='resource-value'></span>
          <span class='resource-max'></span>
          <span class='resource-inc'></span>
        `;
        if (resource.clickText !== null && resource.clickDescription !== null) {
          content += `<br>
            <button class='resource-btn'
              title='${this._escape(resource.clickDescription)}'>
              ${this._escape(resource.clickText)}</button>`;
        }
        if (resource.cost !== null
          && Object.keys(resource.cost).length !== 0) {
          content += "<br>Cost: <span class='resource-cost'></span>";
        }
        el.innerHTML = content;
        resContainer.appendChild(el);
        if (resource.clickAction !== null) {
          const btn = el.getElementsByClassName('resource-btn')[0];
          btn.addEventListener('click', (): void => {
            state.performClick(rkey);
          });
        }
      }
      // create tools footer
      const footer = document.createElement('div');
      footer.className = 'footer';
      footer.innerHTML = `
<button id='dbg-btn-reset'>Reset Game</button>
      `;
      resDiv.appendChild(footer);
      document.getElementById('dbg-btn-reset')?.addEventListener('click',
        (): void => {
          state.reset();
          container.innerHTML = '';
          this._initialized = false;
        });
    }
    for (const rkey of rkeys) {
      const resource = state.resource[rkey];
      if (resource === undefined) continue;
      const el = document.getElementById(`resource-details-${rkey}`);
      if (el !== null && resource.isUnlocked(state)) {
        if (el.className !== 'resource') el.className = 'resource';
        const elV = el.getElementsByClassName('resource-value')[0];
        const elT = el.getElementsByClassName('resource-max')[0];
        const value = resource.valueInWholeNumbers
          ? Math.floor(resource.value)
          : resource.value;
        elV.innerHTML = state.config.formatNumber(value);
        elT.innerHTML = resource.max !== null
          ? ` / ${state.config.formatNumber(resource.max(state))}`
          : '';
        const elB = el.getElementsByClassName('resource-btn');
        if (elB.length > 0) {
          const enabled = state.isPurchasable(resource.cost)
            && (resource.max === null || resource.value < resource.max(state));
          if (enabled) elB[0].removeAttribute('disabled');
          else elB[0].setAttribute('disabled', 'disabled');
        }
        if (resource.inc !== null && resource.inc(state) > 0) {
          const elI = el.getElementsByClassName('resource-inc')[0];
          elI.innerHTML =
            ` +${state.config.formatNumber(resource.inc(state))}/s`;
        }
        if (this._handleClick) {
          const elC = el.getElementsByClassName('resource-cost');
          if (elC.length > 0) {
            elC[0].innerHTML = this._getCostStr(resource, state);
          }
        }
      } else {
        if (el !== null && el.className !== 'resource locked')
          el.className = 'resource locked';
      }
    }
    this._handleClick = false;
  }

  private _escape (text: string): string {
    const escapes: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    const escaper = /[&<>"'/]/g;
    return text.replace(escaper, (match: string): string =>
      escapes[match]);
  }

  private _getCostStr (resource: IResource, state: GameState): string {
    let cost = '';
    for (const rkey of state.resources) {
      if (resource.cost?.[rkey] !== undefined) {
        if (cost !== '') cost += ', ';
        if (rkey === ResourceKey.money) {
          cost += `$${state.config.formatNumber(resource.cost[rkey] ?? 0)}`;
        } else {
          cost += `${state.config.formatNumber(resource.cost[rkey] ?? 0)}
            ${state.resource[rkey]?.name ?? rkey}`;
        }
      }
    }
    return cost;
  }
}
