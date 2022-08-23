export const enum ActionKeys {
  Action = "Space",
  Menu = "Escape",
}

export class Actions {
  public onAction?: () => void;
  public onMenu?: () => void;

  // @todo: add gamepad and mobile support
  constructor(callbacks?: { onAction?: () => void; onMenu?: () => void }) {
    this.onAction = callbacks?.onAction;
    this.onMenu = callbacks?.onMenu;
  }

  public listen(): void {
    window.addEventListener("keydown", this.keyHandler.bind(this));
  }

  public destroy(): void {
    window.removeEventListener("keydown", this.keyHandler.bind(this));
  }

  private keyHandler(event: KeyboardEvent): void {
    if (event.repeat) return;

    switch (event.code) {
      case ActionKeys.Action: {
        if (this.onAction) this.onAction();
        break;
      }
      case ActionKeys.Menu: {
        if (this.onMenu) this.onMenu();
        break;
      }
    }
  }
}
