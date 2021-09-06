interface IRenderer {
  render: (state: GameState) => void;
  onInitialRender?: (state: GameState) => void;
}
