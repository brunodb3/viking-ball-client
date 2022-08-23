import { Container, Graphics } from "pixi.js";

export class Debug extends Container {
  private body: Graphics;
  private center: Graphics;
  private colors: {
    line: number;
    center: number;
  };

  constructor(options?: { lineColor?: number; centerColor?: number }) {
    super();

    this.colors = {
      line: options?.lineColor || 0x00ff00,
      center: options?.centerColor || 0xff0000,
    };

    this.body = new Graphics();
    this.center = new Graphics();

    this.addChild(this.body, this.center);
  }

  public update(data: {
    position: { x: number; y: number };
    vertices: { x: number; y: number }[];
    // ? For some entities, their position might not be the center (see Field.ts)
    center?: { x: number; y: number };
  }): void {
    this.body.clear();
    this.center.clear();
    this.position.set(data.position.x, data.position.y);

    if (data.center) this.center.position.set(data.center.x, data.center.y);

    this.center.beginFill(this.colors.center);
    this.center.drawCircle(0, 0, 1);
    this.center.endFill();

    const last = data.vertices[data.vertices.length - 1];

    this.body.lineStyle(1, this.colors.line);
    this.body.moveTo(last.x, last.y);

    data.vertices.forEach((each) => {
      this.body.lineTo(each.x, each.y);
    });
  }
}
