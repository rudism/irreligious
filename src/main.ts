/// <reference path="./model/GameConfig.ts" />
/// <reference path="./render/DebugRenderer.ts" />

const versionMajor = 2;
const versionMinor = 0;

let globalStartTime = 0;
let globalTimeout: number | null = null;
const cycleLength = 250;

function gameLoop(state: GameState, renderer: IRenderer): void {
  // figure out how much actual time has passed
  const elapsedTime: number =
    globalStartTime > 0 ? new Date().getTime() - globalStartTime : 0;

  state.advance(elapsedTime);
  renderer.render(state);

  // run again in 1sec
  globalStartTime = new Date().getTime();
  globalTimeout = setTimeout((): void => {
    gameLoop(state, renderer);
  }, cycleLength);
}

function startGame(state: GameState, renderer: IRenderer): void {
  state.load(); // load saved game if one exists
  gameLoop(state, renderer); // start the main loop
}

function initialRender(state: GameState): void {
  if (state.logger === null) return;
  state.logger
    .unsafeMsg(`<strong>Welcome to irreligio.us!</strong> <em>alpha v${versionMajor}.${versionMinor}</em>
<br><br>
The game is still in an active state of development and nowhere near its final form. This is a debugging interface that can show all resources even before they're unlocked, and many factors may be sped up significantly to aid in development. There is a chance that playing it now may spoil aspects of the game for you later when it's closer to being finished.
<br><br>
Additionally, the game has not been and is not in any kind of state to be playtested or balanced in any way, and even though it auto-saves and resumes, it's changing so much that save data may become corrupt and force you to clear cookies and localstorage and lose all progress before the game loads again. If you want to actually play a fun incremental game, this isn't really ready yet.
<br><br>
The game's source code on <a href='https://github.com/rudism/irreligious'>Github</a> is likely further along than this. Have fun!<br><br>`);
}

// run with default config at startup
((): void => {
  const config = new GameConfig(versionMajor, versionMinor);

  // debug values to make the game play faster while testing
  config.cfgTitheAmount = 1000;
  config.cfgTimeBetweenTithes = 5000;
  config.cfgCryptoReturnAmount = 100;
  config.cfgCredibilityRestoreRate = 5;
  config.cfgPastorRecruitRate = 0.5;

  const renderer = new DebugRenderer();
  renderer.onInitialRender = initialRender;
  const state = config.generateState();

  // re-run main loop immediately on user clicks
  state.onResourceClick.push((): void => {
    if (globalTimeout !== null) {
      clearTimeout(globalTimeout);
      gameLoop(state, renderer);
    }
  });

  if (document.readyState !== 'loading') startGame(state, renderer);
  else
    document.addEventListener('DOMContentLoaded', (): void => {
      startGame(state, renderer);
    });
})();
