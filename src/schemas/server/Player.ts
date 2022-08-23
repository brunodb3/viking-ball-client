//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 1.0.34
//

import { Schema, type, ArraySchema } from "@colyseus/schema";
import { Vector } from "./Vector";
import { Animation } from "./Animation";

export class Player extends Schema {
  @type("string") public id!: string;
  @type("string") public side!: string;
  @type("number") public score!: number;
  @type("number") public width!: number;
  @type("number") public height!: number;
  @type("number") public direction!: number;
  @type(Vector) public position: Vector = new Vector();
  @type(Vector) public velocity: Vector = new Vector();
  @type([Vector]) public vertices: ArraySchema<Vector> =
    new ArraySchema<Vector>();
  @type(Animation) public animation: Animation = new Animation();
}
