class DebugLogger implements ILogger {
  private readonly _container: HTMLElement;

  constructor (container: HTMLElement) {
    this._container = container;
  }

  public msg (text: string): void {
    const p: HTMLElement = document.createElement('p');
    p.innerText = text;
    this._container.appendChild(p);
    if (this._container.parentElement !== null) {
      this._container.parentElement.scrollTop =
        this._container.parentElement.scrollHeight;
    }
  }
}
