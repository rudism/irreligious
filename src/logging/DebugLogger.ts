class DebugLogger implements ILogger {
  private readonly _container: HTMLElement;

  constructor(container: HTMLElement) {
    this._container = container;
  }

  public msg(text: string): void {
    this._doMsg(text, true);
  }

  public unsafeMsg(text: string): void {
    this._doMsg(text, false);
  }

  private _doMsg(text: string, safe: boolean): void {
    const el = document.createElement('p');
    if (safe) {
      el.innerText = text;
    } else {
      el.innerHTML = text;
    }
    this._container.appendChild(el);
    if (this._container.parentElement !== null) {
      this._container.parentElement.scrollTop =
        this._container.parentElement.scrollHeight;
    }
  }
}
