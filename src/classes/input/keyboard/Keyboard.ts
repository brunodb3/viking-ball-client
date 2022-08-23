export class Keyboard {
  public state: { [key: string]: boolean } = {
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
    ShiftLeft: false,
    ShiftRight: false,
  };

  public listen(): void {
    window.addEventListener("keyup", this.keyHandler.bind(this));
    window.addEventListener("keydown", this.keyHandler.bind(this));
  }

  public destroy(): void {
    window.removeEventListener("keyup", this.keyHandler.bind(this));
    window.removeEventListener("keydown", this.keyHandler.bind(this));
  }

  public reset(): void {
    this.state = {
      KeyW: false,
      KeyA: false,
      KeyS: false,
      KeyD: false,
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      Space: false,
      ShiftLeft: false,
      ShiftRight: false,
    };
  }

  private keyHandler(event: KeyboardEvent): void {
    this.state[event.code] = event.type === "keydown";
  }
}
