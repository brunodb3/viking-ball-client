import Victor from "victor";
import { Container, Graphics, Sprite } from "pixi.js";

import { Debug } from "@classes";
import { lerpVector } from "@utils";
import { IVector } from "@interfaces";
import { Ball as BallSchema } from "@schemas";

export class Ball extends Container {
  public server: {
    debug: Debug;
    lastData?: BallSchema;
  };
  public settings: {
    interpolation: {
      rate: number;
      enabled: boolean;
    };
  };

  private sprite: Sprite;
  private shadow: Graphics;
  private initialPosition: { x: number; y: number };

  constructor(x: number = 350, y: number = 192) {
    super();

    this.initialPosition = { x, y };
    this.server = {
      debug: new Debug(),
    };
    this.settings = {
      interpolation: {
        rate: 0.5,
        enabled: true,
      },
    };

    this.sprite = Sprite.from("ball");
    this.sprite.anchor.set(0.5);

    this.shadow = new Graphics();
    this.shadow.beginFill(0x000000, 0.3);
    this.shadow.position.set(this.position.x, this.position.y + 5);
    this.shadow.drawEllipse(0, 0, 10, 5);

    this.addChild(this.shadow);
    this.addChild(this.sprite);

    this.reset();
  }

  public reset(): void {
    this.position.set(this.initialPosition.x, this.initialPosition.y);
  }

  public updateFromServer(data: BallSchema): void {
    this.server.lastData = data;
    this.server.debug.update({
      position: data.position,
      vertices: data.vertices.map((each) => ({ x: each.x, y: each.y })),
    });

    let newPosition: IVector = data.position;

    if (this.settings.interpolation.enabled) {
      newPosition = lerpVector(
        this.position,
        data.position,
        this.settings.interpolation.rate
      );
    }

    this.position.x = newPosition.x;
    this.position.y = newPosition.y;

    const velocity = new Victor(data.velocity.x, data.velocity.y);

    this.sprite.rotation = this.sprite.rotation + velocity.length();
  }
}
