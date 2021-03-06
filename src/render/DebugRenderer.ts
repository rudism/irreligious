/// <reference path="../logging/DebugLogger.ts" />

class DebugRenderer implements IRenderer {
  public onInitialRender?: (state: GameState) => void;

  private _initialized = false;
  private _handleClick = true;

  public render(state: GameState): void {
    const rkeys = state.resources;
    const container = document.getElementById('irreligious-game');
    if (!this._initialized) {
      if (container === null) {
        console.error('could not find game container');
        return;
      }
      state.onAction.push((): void => {
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
        if (resource === undefined || resource.label === undefined) continue;
        const resContainer = document.getElementById(
          `resource-container-${resource.resourceType}`
        );
        if (resContainer === null) continue;
        const el = document.createElement('div');
        el.className = 'resource locked';
        el.id = `resource-details-${rkey}`;
        let content = `
          <span class='resource-title'
            title='${this._escape(resource.description)}'>
            ${this._escape(resource.label)}</span><br>
          <span class='resource-value'></span>
          <span class='resource-max'></span>
          <span class='resource-inc'></span>
        `;
        if (resource.userActions !== undefined) {
          content += '<br>';
          for (let i = 0; i < resource.userActions.length; i++) {
            const action = resource.userActions[i];
            content += `<button
              id='resource-btn-${rkey}-${i}'
              class='resource-btn'
              title='${this._escape(action.description)}'>
              ${this._escape(action.name)}</button>`;
          }
        }
        if (
          resource.cost !== undefined &&
          Object.keys(resource.cost(state)).length !== 0
        ) {
          content += "<br>Cost: <span class='resource-cost'></span>";
        }
        el.innerHTML = content;
        resContainer.appendChild(el);
        if (resource.userActions !== undefined) {
          for (let i = 0; i < resource.userActions.length; i++) {
            const btn = document.getElementById(`resource-btn-${rkey}-${i}`);
            btn?.addEventListener('click', (): void => {
              state.performAction(rkey, i);
            });
          }
        }
      }
      // create tools footer
      const footer = document.createElement('div');
      footer.className = 'footer';
      footer.innerHTML = `
<button id='dbg-btn-reset'>Reset Game</button>
      `;
      resDiv.appendChild(footer);
      document
        .getElementById('dbg-btn-reset')
        ?.addEventListener('click', (): void => {
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
        const value = formatNumber(
          resource.valueInWholeNumbers
            ? Math.floor(resource.value)
            : resource.value
        );
        const max =
          resource.max !== undefined ? resource.max(state) : undefined;
        if (elV.innerHTML !== value) elV.innerHTML = value;
        const maxStr =
          max !== undefined
            ? ` / ${formatNumber(
                resource.valueInWholeNumbers ? Math.floor(max) : max
              )}`
            : '';
        if (elT.innerHTML !== maxStr) elT.innerHTML = maxStr;
        if (resource.userActions !== undefined) {
          for (let i = 0; i < resource.userActions.length; i++) {
            const elB = document.getElementById(`resource-btn-${rkey}-${i}`);
            if (elB === null) continue;
            if (resource.userActions[i].isEnabled(state)) {
              elB.removeAttribute('disabled');
            } else {
              elB.setAttribute('disabled', 'disabled');
            }
          }
        }
        if (resource.inc !== undefined) {
          const resInc = resource.inc(state);
          const inc = resourceNumberSum(resInc);
          const elI = el.getElementsByClassName('resource-inc')[0];
          if (inc !== 0) {
            const incStr = ` ${inc > 0 ? '+' : ''}${formatNumber(inc)}/s`;
            if (elI.innerHTML !== incStr) {
              elI.innerHTML = incStr;
              elI.setAttribute('title', this._getIncDetails(resource, state));
            }
          } else if (elI.innerHTML !== '') {
            elI.innerHTML = '';
            elI.removeAttribute('title');
          }
        }
        const elC = el.getElementsByClassName('resource-cost');
        if (elC.length > 0) {
          const costStr = this._getCostStr(resource, state);
          if (elC[0].innerHTML !== costStr) {
            elC[0].innerHTML = costStr;
          }
        }
      } else {
        if (el !== null && el.className !== 'resource locked')
          el.className = 'resource locked';
      }
    }
    this._handleClick = false;

    if (!this._initialized && this.onInitialRender !== undefined) {
      this.onInitialRender(state);
    }
    this._initialized = true;
  }

  private _escape(text: string): string {
    const escapes: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    const escaper = /[&<>"'/]/g;
    return text.replace(escaper, (match: string): string => escapes[match]);
  }

  private _getCostStr(resource: IResource, state: GameState): string {
    let cost = '';
    if (resource.cost === undefined) return cost;
    for (const rkey of state.resources) {
      const rcost = resource.cost(state)[rkey];
      if (rcost !== undefined && rcost > 0) {
        if (cost !== '') cost += ', ';
        if (rkey === ResourceKey.money) {
          cost += `$${formatNumber(rcost)}`;
        } else {
          cost += `${formatNumber(rcost)} ${
            (rcost > 1
              ? state.resource[rkey]?.pluralName
              : state.resource[rkey]?.singularName) ?? rkey
          }`;
        }
      }
    }
    return cost;
  }

  private _getIncDetails(resource: IResource, state: GameState): string {
    let inc = '';
    if (resource.inc === undefined) return inc;
    for (const rkey of state.resources) {
      const incRes = state.resource[rkey];
      if (incRes === undefined || incRes.label === undefined) continue;
      const rinc = resource.inc(state)[rkey];
      if (rinc !== undefined && rinc !== 0) {
        if (inc !== '') inc += '\n';
        inc += `${incRes.label}: ${rinc > 0 ? '+' : ''}${formatNumber(rinc)}/s`;
      }
    }
    return inc;
  }
}
