class ConsoleLogger implements ILogger {
  public msg(text: string): void {
    console.log(text);
  }

  public unsafeMsg(text: string): void {
    console.error(text);
  }
}
