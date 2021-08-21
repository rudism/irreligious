/// <reference path="./model/GameConfig.ts" />
/// <reference path="./model/GameState.ts" />
/// <reference path="./render/DebugRenderer.ts" />
/// <reference path="./render/IRenderer.ts" />

let globalStartTime: number = 0;
let globalTimeout: number = null;
let cycleLength: number = 250;

function gameLoop (state: GameState, renderer: IRenderer): void {
  // figure out how much actual time has passed
  const elapsedTime: number = globalStartTime > 0
    ? (new Date()).getTime() - globalStartTime : 0;

  renderer.render(state);
  state.advance(elapsedTime);

  // run again in 1sec
  globalStartTime = (new Date()).getTime();
  globalTimeout = setTimeout((): void =>
    gameLoop(state, renderer), cycleLength);
}

// run with default config at startup
((): void => {
  const config: GameConfig = new GameConfig();
  const renderer: IRenderer = new DebugRenderer();
  const state: GameState = config.generateState();

  // re-run main loop immediately on user clicks
  state.onResourceClick.push((): void => {
    if (globalTimeout !== null) {
      clearTimeout(globalTimeout);
      gameLoop(state, renderer);
    }
  });

  if (document.readyState !== 'loading') gameLoop(state, renderer);
  else document.addEventListener('DOMContentLoaded', (): void =>
    gameLoop(state, renderer));
})();
