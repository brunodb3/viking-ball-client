//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 1.0.34
//

import { Schema, type, ArraySchema } from "@colyseus/schema";
import { Vector } from "./Vector";

export class Goal extends Schema {
  @type("number") public width!: number;
  @type("number") public height!: number;
  @type(Vector) public position: Vector = new Vector();
  @type([Vector]) public vertices: ArraySchema<Vector> =
    new ArraySchema<Vector>();
}
