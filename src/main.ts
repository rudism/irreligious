/// <reference path="./model/GameConfig.ts" />
/// <reference path="./render/DebugRenderer.ts" />

let globalStartTime: number = 0;
let globalTimeout: number = null;
let cycleLength: number = 250;

function gameLoop (state: GameState, renderer: IRenderer): void {
  // figure out how much actual time has passed
  const elapsedTime: number = globalStartTime > 0
    ? (new Date()).getTime() - globalStartTime : 0;

  state.advance(elapsedTime);
  renderer.render(state);

  // run again in 1sec
  globalStartTime = (new Date()).getTime();
  globalTimeout = setTimeout((): void =>
    gameLoop(state, renderer), cycleLength);
}

function startGame (state: GameState, renderer: IRenderer): void {
  state.load(); // load saved game if one exists
  gameLoop(state, renderer); // start the main loop
}

// run with default config at startup
((): void => {
  const config: GameConfig = new GameConfig();

  // debug values to make the game play faster while testing
  config.baseTitheAmount = 1000;
  config.baseCryptoReturnAmount = 100;
  config.baseCredibilityRestoreRate = 5;

  const renderer: IRenderer = new DebugRenderer();
  const state: GameState = config.generateState();

  // re-run main loop immediately on user clicks
  state.onResourceClick.push((): void => {
    if (globalTimeout !== null) {
      clearTimeout(globalTimeout);
      gameLoop(state, renderer);
    }
  });

  if (document.readyState !== 'loading') startGame(state, renderer);
  else document.addEventListener('DOMContentLoaded', (): void =>
    startGame(state, renderer));
})();
