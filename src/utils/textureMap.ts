export interface ITextureMap {
  width: number;
  height: number;
}

export const textureMap: { [key: string]: ITextureMap } = {
  player: {
    width: 64,
    height: 64,
  },
  ball: {
    width: 17,
    height: 17,
  },
  goal: {
    width: 44 - 30, // ? We remove 30px from the width so the ball can go in
    height: 144,
  },
  field: {
    width: 64 * 11, // ? 64 per tile, times 11 tiles
    height: 64 * 6, // ? 64 per tile, times 6 tiles
  },
};
