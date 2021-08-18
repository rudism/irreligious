/// <reference path="./IResource.ts" />
/// <reference path="./resource/Religion.ts" />

class GameConfig {
  public worldPopulation: number = 790000000;

  // religion configs
  public relChristianityShare: number = 0.325;
  public relIslamShare: number = 0.215;
  public relHinduismShare: number = 0.16;
  public relBuddhismShare: number = 0.06;
  public relSikhismShare: number = 0.04;
  public relJudaismShare: number = 0.02;
  public relOtherShare:number = 0.02;
  public relNoneShare: number = 0.16;

  constructor () {}
}
