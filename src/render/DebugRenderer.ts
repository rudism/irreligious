/// <reference path="../model/logging/DebugLogger.ts" />

class DebugRenderer implements IRenderer {
  private _initialized: boolean = false;
  private _handleClick: boolean = true;

  public render (state: GameState): void {
    if (!this._initialized) {
      const container: HTMLElement =
        document.getElementById('irreligious-game');
      this._initialized = true;
      state.onResourceClick.push((): void => {
        this._handleClick = true;
      });
      const style: HTMLElement = document.createElement('link');
      style.setAttribute('rel', 'stylesheet');
      style.setAttribute('href', 'css/debugger.css');
      const head: HTMLElement = document.getElementsByTagName('head')[0];
      head.appendChild(style);
      // create resource area and logging area
      const resDiv: HTMLElement = document.createElement('div');
      resDiv.id = 'resource-section';
      container.appendChild(resDiv);
      const logDiv: HTMLElement = document.createElement('div');
      logDiv.id = 'logging-section';
      container.appendChild(logDiv);
      const logContent: HTMLElement = document.createElement('div');
      logDiv.appendChild(logContent);
      state.logger = new DebugLogger(logContent);
      // create containers for each resource type
      for (const item in ResourceType) {
        if (isNaN(Number(item))) {
          const el: HTMLElement = document.createElement('div');
          el.id = `resource-container-${ResourceType[item]}`;
          el.className = 'resource-type-container';
          resDiv.appendChild(el);
        }
      }
    }
    const rkeys: string[] = state.getResources();
    for (const rkey of rkeys) {
      const resource: IResource = state.getResource(rkey);
      const container: HTMLElement = document
        .getElementById(`resource-container-${resource.resourceType}`);
      if (resource.isUnlocked(state)) {
        let el: HTMLElement = document
          .getElementById(`resource-details-${rkey}`);
        if (el === null) {
          el = document.createElement('div');
          el.className = 'resource';
          el.id = `resource-details-${rkey}`;
          let content: string = `
            <span class='resource-title'
              title='${this._escape(resource.description)}'>
              ${this._escape(resource.name
                ? resource.name
                : rkey)}</span><br>
            <span class='resource-value'></span>
            <span class='resource-max'></span>
            <span class='resource-inc'></span>
          `;
          if (resource.clickText !== null) {
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
          container.appendChild(el);
          if (resource.clickAction !== null) {
            const btn: Element =
              el.getElementsByClassName('resource-btn')[0];
            btn.addEventListener('click', (): void =>
              state.performClick(rkey));
          }
        }
        const elV: Element =
          el.getElementsByClassName('resource-value')[0];
        const elT: Element =
          el.getElementsByClassName('resource-max')[0];
        elV.innerHTML = state.formatNumber(resource.value);
        elT.innerHTML = resource.max !== null
          && resource.max(state) !== null
          ? ` / ${state.formatNumber(resource.max(state))}`
          : '';
        const elB: HTMLCollectionOf<Element> =
          el.getElementsByClassName('resource-btn');
        if (elB.length > 0) {
          const enabled: boolean = state.isPurchasable(resource.cost)
            && resource.value < resource.max(state);
          if (enabled) elB[0].removeAttribute('disabled');
          else elB[0].setAttribute('disabled', 'disabled');
        }
        if (this._handleClick) {
          if (resource.inc !== null && resource.inc(state) > 0) {
            const elI: Element =
              el.getElementsByClassName('resource-inc')[0];
            elI.innerHTML =
              ` +${state.formatNumber(resource.inc(state))}/s`;
          }
          const elC: HTMLCollectionOf<Element> =
            el.getElementsByClassName('resource-cost');
          if (elC.length > 0) {
            elC[0].innerHTML = this._getCostStr(resource, state);
          }
        }
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
      '/': '&#x2F;'
    }
    const escaper: RegExp = /[&<>"'\/]/g;
    return text.replace(escaper, (match: string): string =>
      escapes[match]);
  }

  private _getCostStr (resource: IResource, state: GameState): string {
    let cost: string = '';
    for (const rkey of state.getResources()) {
      if (resource.cost[rkey] !== undefined) {
        if (cost !== '') cost += ', ';
        if (rkey === 'money') {
          cost += `$${state.formatNumber(resource.cost[rkey])}`;
        } else {
          cost += `${state.formatNumber(resource.cost[rkey])}
            ${state.getResource(rkey).name}`;
        }
      }
    }
    return cost;
  }
}
