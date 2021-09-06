interface ILogger {
  msg: (text: string) => void;
  unsafeMsg: (text: string) => void;
}
