import { Container, Sprite } from "pixi.js";

import { Debug } from "@classes";
import { Field as FieldSchema } from "@schemas";
import { texturesFromSpritesheet } from "@utils";

export class Field extends Container {
  public server: {
    debug: Debug;
    lastData?: FieldSchema;
  };

  constructor() {
    super();

    this.server = {
      debug: new Debug(),
    };

    // ? These IDs are based on "public/spritesheets/field.png" for each tile
    const map = [
      [9, 26, 9, 26, 9, 26, 9, 26, 9, 26, 9],
      [9, 6, 33, 34, 33, 42, 33, 34, 33, 8, 9],
      [9, 17, 9, 26, 9, 40, 9, 26, 9, 21, 9],
      [9, 15, 9, 26, 9, 40, 9, 26, 9, 19, 9],
      [9, 2, 27, 28, 27, 36, 27, 28, 27, 4, 9],
      [9, 26, 9, 26, 9, 26, 9, 26, 9, 26, 9],
    ];

    const fieldTextures = texturesFromSpritesheet({
      source: "field_sheet",
      size: 64,
      frames: 42,
    });

    for (const [y, row] of map.entries()) {
      for (const [x, column] of row.entries()) {
        const scale = 1.5;
        const texture = fieldTextures[column - 1];

        const sprite = new Sprite(texture);
        sprite.scale.set(scale);
        sprite.position.set(
          x * texture.width * scale,
          y * texture.height * scale
        );

        this.addChild(sprite);
      }
    }
  }

  public updateFromServer(data: FieldSchema): void {
    this.server.lastData = data;
    this.server.debug.update({
      center: data.center,
      position: data.position,
      vertices: data.vertices.map((each) => ({ x: each.x, y: each.y })),
    });
  }
}
