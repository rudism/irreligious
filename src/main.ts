/// <reference path="./model/GameConfig.ts" />
/// <reference path="./model/GameState.ts" />

let globalStartTime = 0;

function gameLoop (state: GameState): void {
  // figure out how much actual time has passed
  const elapsedTime = globalStartTime > 0
    ? (new Date()).getTime() - globalStartTime : 0;

  state.advance(elapsedTime);

  // run again in 1sec
  globalStartTime = (new Date()).getTime();
  setTimeout(() => gameLoop(state), 1000);
}

// run with default config at startup
(() => {
  const config = new GameConfig();
  const state = config.generateState();

  if (document.readyState !== 'loading') gameLoop(state);
  else document.addEventListener('DOMContentLoaded', () => gameLoop(state));
})();
