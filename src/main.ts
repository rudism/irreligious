/// <reference path="./model/GameConfig.ts" />
/// <reference path="./model/GameState.ts" />
/// <reference path="./render/DebugRenderer.ts" />
/// <reference path="./render/IRenderer.ts" />

let globalStartTime = 0;
let globalTimeout: number = null;

function gameLoop (state: GameState, renderer: IRenderer): void {
  // figure out how much actual time has passed
  const elapsedTime = globalStartTime > 0
    ? (new Date()).getTime() - globalStartTime : 0;

  renderer.render(state);
  state.advance(elapsedTime);

  // run again in 1sec
  globalStartTime = (new Date()).getTime();
  globalTimeout = setTimeout(() => gameLoop(state, renderer), 1000);
}

// run with default config at startup
(() => {
  const config = new GameConfig();
  const renderer = new DebugRenderer();
  const state = config.generateState();

  // re-run main loop immediately on user clicks
  state.onResourceClick.push(() => {
    if (globalTimeout !== null) {
      clearTimeout(globalTimeout);
      gameLoop(state, renderer);
    }
  });

  if (document.readyState !== 'loading') gameLoop(state, renderer);
  else document.addEventListener('DOMContentLoaded', () => gameLoop(state, renderer));
})();
