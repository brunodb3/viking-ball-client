//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 1.0.34
//

import { Schema, type } from "@colyseus/schema";

export class Animation extends Schema {
  @type("string") public name!: string;
  @type("number") public speed!: number;
  @type("boolean") public blocking!: boolean;
}
