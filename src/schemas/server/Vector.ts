//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 1.0.34
//

import { Schema, type } from "@colyseus/schema";

export class Vector extends Schema {
  @type("number") public x!: number;
  @type("number") public y!: number;
}
