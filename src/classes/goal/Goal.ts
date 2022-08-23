import { Container, Sprite } from "pixi.js";

import { Debug } from "@classes";
import { Goal as GoalSchema } from "@schemas";

export class Goal extends Container {
  public server: {
    debug: Debug;
    lastData?: GoalSchema;
  };

  private sprite: Sprite;

  constructor(side: "left" | "right") {
    super();

    // @todo: determine this on server side?
    if (side === "right") {
      this.scale.x = -this.scale.x;
    }

    this.server = {
      debug: new Debug(),
    };

    this.sprite = Sprite.from("goal");

    this.sprite.anchor.set(0.5);

    this.addChild(this.sprite);
  }

  public updateFromServer(data: GoalSchema): void {
    this.server.lastData = data;
    this.server.debug.update({
      position: data.position,
      vertices: data.vertices.map((each) => ({ x: each.x, y: each.y })),
    });

    this.position.x = data.position.x;
    this.position.y = data.position.y;
  }
}
