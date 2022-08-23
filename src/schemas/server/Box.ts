//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 1.0.34
//

import { Schema, type } from "@colyseus/schema";
import { Rectangle } from "./Rectangle";

export class Box extends Schema {
  @type(Rectangle) public top: Rectangle = new Rectangle();
  @type(Rectangle) public bottom: Rectangle = new Rectangle();
  @type(Rectangle) public left: Rectangle = new Rectangle();
  @type(Rectangle) public right: Rectangle = new Rectangle();
}
