import Victor from "victor";
import { Ticker } from "pixi.js";

import { Keyboard } from "@classes";
import { IPlayerInput } from "@interfaces";

export class Movement {
  private ticker: Ticker;
  private keyboard: Keyboard;
  private keyboardVector: Victor;
  private movementKeys: {
    north: boolean;
    south: boolean;
    east: boolean;
    west: boolean;
    run: boolean;
  };

  public onMove?: (input: IPlayerInput) => void;

  // @todo: add gamepad and mobile support
  constructor(callbacks?: { onMove?: (input: IPlayerInput) => void }) {
    this.keyboard = new Keyboard();
    this.keyboardVector = new Victor(0, 0);

    this.ticker = new Ticker();
    this.ticker.add(this.tick.bind(this));

    this.onMove = callbacks?.onMove;

    this.movementKeys = {
      north: false,
      south: false,
      east: false,
      west: false,
      run: false,
    };
  }

  public listen(): void {
    this.ticker.start();
    this.keyboard.listen();
  }

  public destroy(): void {
    this.ticker.destroy();
    this.keyboard.destroy();
  }

  private tick(): void {
    this.pollKeyboard();
  }

  private pollKeyboard(): void {
    this.movementKeys = {
      north: this.keyboard.state.KeyW || this.keyboard.state.ArrowUp,
      south: this.keyboard.state.KeyS || this.keyboard.state.ArrowDown,
      east: this.keyboard.state.KeyD || this.keyboard.state.ArrowRight,
      west: this.keyboard.state.KeyA || this.keyboard.state.ArrowLeft,
      run: this.keyboard.state.ShiftLeft || this.keyboard.state.ShiftRight,
    };

    this.calculateKeyboardVector(
      this.movementKeys.north,
      this.movementKeys.south,
      this.movementKeys.east,
      this.movementKeys.west
    );

    if (this.onMove && this.keyboardVector.length() > 0)
      this.onMove({
        force: this.keyboardVector,
        running: this.movementKeys.run,
      });
  }

  private calculateKeyboardVector(
    north: boolean,
    south: boolean,
    east: boolean,
    west: boolean
  ): void {
    let direction;
    let movement;

    if (north) direction = "N";
    if (south) direction = "S";
    if (east) direction = "E";
    if (west) direction = "W";

    if (north && east) direction = "NE";
    if (north && west) direction = "NW";
    if (south && east) direction = "SE";
    if (south && west) direction = "SW";

    switch (direction) {
      case "N":
        movement = new Victor(0, 1);
        break;
      case "NW":
        movement = new Victor(-1, 1);
        break;
      case "NE":
        movement = new Victor(1, 1);
        break;
      case "S":
        movement = new Victor(0, -1);
        break;
      case "SW":
        movement = new Victor(-1, -1);
        break;
      case "SE":
        movement = new Victor(1, -1);
        break;
      case "W":
        movement = new Victor(-1, 0);
        break;
      case "E":
        movement = new Victor(1, 0);
        break;
      default:
        movement = new Victor(0, 0);
        break;
    }

    this.keyboardVector.copy(movement);
  }
}
