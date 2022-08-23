//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 1.0.34
//

import { Schema, type, MapSchema } from "@colyseus/schema";
import { Ball } from "./Ball";
import { Field } from "./Field";
import { Goal } from "./Goal";
import { Player } from "./Player";

export class Match extends Schema {
  @type(Ball) public ball: Ball = new Ball();
  @type(Field) public field: Field = new Field();
  @type(Goal) public goalLeft: Goal = new Goal();
  @type(Goal) public goalRight: Goal = new Goal();
  @type("string") public state!: string;
  @type("boolean") public playing!: boolean;
  @type("string") public timeRemaining!: string;
  @type({ map: Player }) public players: MapSchema<Player> =
    new MapSchema<Player>();
  @type("string") public ballPossession!: string;
}
