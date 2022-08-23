import { Texture, Rectangle } from "pixi.js";

export function texturesFromSpritesheet(options: {
  source: string;
  size: number;
  frames: number;
}): Texture[] {
  const { source, size, frames } = options;

  const spritesheet = Texture.from(source);
  const sheetWidth = spritesheet.width / size;
  const baseTexture = spritesheet.castToBaseTexture();

  const textures: Texture[] = [];

  for (let i = 0; i < frames; i++) {
    const y = Math.floor(i / sheetWidth);
    const x = i - y * sheetWidth;
    textures.push(
      new Texture(baseTexture, new Rectangle(x * size, y * size, size, size))
    );
  }

  return textures;
}

export function texturesFromDirectionalSpritesheet(options: {
  source: string;
  size: number;
  frames: number;
}): Texture[][] {
  const textures = texturesFromSpritesheet(options);

  const { frames } = options;
  const framesPerDirection = frames / 8;

  const directions: Texture[][] = [];
  for (let i = 0; i < 8; i++) {
    const direction = textures.slice(
      i * framesPerDirection,
      i * framesPerDirection + framesPerDirection
    );

    directions.push(direction);
  }

  return directions;
}
