import {
  AnimatedSprite,
  Application,
  Container,
  Graphics,
  Resource,
  Texture,
} from "pixi.js";

import { Debug } from "@classes";
import { IVector } from "@interfaces";
import { Player as PlayerSchema } from "@schemas";
import { lerpVector, texturesFromDirectionalSpritesheet } from "@utils";

export class Player extends Container {
  public shadow: Graphics;
  public pixiApp: Application;
  public sprite: AnimatedSprite;
  public runTextures: Texture<Resource>[];
  public idleTextures: Texture<Resource>[];
  public kickTextures: Texture<Resource>[];
  public tackleTextures: Texture<Resource>[];
  public runDirections: Texture<Resource>[][];
  public idleDirections: Texture<Resource>[][];
  public kickDirections: Texture<Resource>[][];
  public tackleDirections: Texture<Resource>[][];
  public settings: {
    interpolation: {
      rate: number;
      enabled: boolean;
    };
  };
  public server: {
    debug: Debug;
    lastData?: PlayerSchema;
  };

  constructor(options: { pixiApp: Application }) {
    super();

    this.pixiApp = options.pixiApp;
    this.server = {
      debug: new Debug(),
    };
    this.settings = {
      interpolation: {
        rate: 0.2,
        enabled: true,
      },
    };

    this.runDirections = texturesFromDirectionalSpritesheet({
      source: "viking_run",
      size: 64,
      frames: 88,
    });
    this.idleDirections = texturesFromDirectionalSpritesheet({
      source: "viking_idle",
      size: 64,
      frames: 80,
    });
    this.kickDirections = texturesFromDirectionalSpritesheet({
      source: "viking_kick",
      size: 64,
      frames: 80,
    });
    this.tackleDirections = texturesFromDirectionalSpritesheet({
      source: "viking_tackle",
      size: 64,
      frames: 80,
    });

    this.runTextures = this.runDirections[0];
    this.idleTextures = this.idleDirections[0];
    this.kickTextures = this.kickDirections[0];
    this.tackleTextures = this.tackleDirections[0];

    this.sprite = new AnimatedSprite(this.idleTextures);
    this.sprite.anchor.set(0.5);

    this.shadow = new Graphics();
    this.shadow.beginFill(0x000000, 0.3);
    this.shadow.position.set(this.position.x, this.position.y + 20);
    this.shadow.drawEllipse(0, 0, 20, 5);

    this.addChild(this.shadow);
    this.addChild(this.sprite);

    this.pixiApp.ticker.add(this.tick.bind(this));
  }

  public tick(): void {
    if (!this.sprite.playing) this.sprite.play();

    this.applyServerData();
  }

  public updateFromServer(data: PlayerSchema): void {
    this.server.lastData = data;
    this.server.debug.update({
      position: data.position,
      vertices: data.vertices.map((each) => ({ x: each.x, y: each.y })),
    });
  }

  private applyServerData(): void {
    if (!this.server.lastData) return;

    let newPosition: IVector = this.server.lastData.position;

    if (this.settings.interpolation.enabled) {
      newPosition = lerpVector(
        this.position,
        this.server.lastData.position,
        this.settings.interpolation.rate
      );
    }

    this.position.x = newPosition.x;
    this.position.y = newPosition.y;

    this.sprite.animationSpeed =
      this.server.lastData.animation.speed || this.sprite.animationSpeed;

    let textures: Texture[] = [];

    switch (this.server.lastData.animation.name) {
      case "idle":
        textures = this.idleDirections[this.server.lastData.direction];
        break;
      case "run":
        textures = this.runDirections[this.server.lastData.direction];
        break;
      // @todo: kick animation shouldn't come from state, but from a message?
      case "kick":
        textures = this.kickDirections[this.server.lastData.direction];
        break;
      // @todo: tackle animation shouldn't come from state, but from a message?
      case "tackle":
        textures = this.tackleDirections[this.server.lastData.direction];
        break;
      default:
        textures = this.idleDirections[this.server.lastData.direction];
        break;
    }

    if (this.sprite.textures !== textures) {
      this.sprite.textures = textures;
      this.sprite.gotoAndPlay(0);
    }
  }
}
