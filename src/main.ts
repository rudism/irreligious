/// <reference path="./model/GameConfig.ts" />

let globalStartTime = 0;

function gameLoop (config: GameConfig): void {
  // figure out how much actual time has passed
  const elapsedTime = globalStartTime > 0
    ? (new Date()).getTime() - globalStartTime : 0;

  // run again in 1sec
  globalStartTime = (new Date()).getTime();
  setTimeout(() => gameLoop(config), 1000);
}

// run with default config at startup
(() => {
  const config = new GameConfig();
  if (document.readyState !== 'loading') gameLoop(config);
  else document.addEventListener('DOMContentLoaded', () => gameLoop(config));
})();
