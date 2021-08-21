/// <reference path="./ILogger.ts" />

class ConsoleLogger implements ILogger {
  public msg (text: string): void {
    console.log(text); // tslint:disable-line
  }
}
