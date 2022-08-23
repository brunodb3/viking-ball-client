import { Client, Room } from "colyseus.js";

import { environment } from "@utils";

export class Network {
  public rooms: Map<string, Room>;

  private client: Client;

  constructor() {
    this.rooms = new Map();
    this.client = new Client(environment.serverUrl);
  }

  public send(name: string, type: string | number, message?: any): void {
    const room = this.rooms.get(name);
    if (!room) return;
    room.send(type, message);
  }

  public async joinLobby(): Promise<void> {
    const room = await this.client.joinOrCreate("lobby");
    this.rooms.set("lobby", room);
    room.onLeave(() => this.rooms.delete("lobby"));
  }

  public async joinMatch(): Promise<void> {
    const room = await this.client.joinOrCreate("match");
    this.rooms.set("match", room);
    room.onLeave(() => this.rooms.delete("match"));
  }

  public async createPrivateMatch(): Promise<void> {
    const room = await this.client.create("match", { private: true });
    this.rooms.set("match", room);
    room.onLeave(() => this.rooms.delete("match"));
  }

  public async joinPrivateMatch(roomId: string): Promise<void> {
    const room = await this.client.joinById(roomId, {
      private: true,
      room: roomId,
    });
    this.rooms.set("match", room);
    room.onLeave(() => this.rooms.delete("match"));
  }

  public async leaveRoom(name: string): Promise<void> {
    const room = this.rooms.get(name);
    if (!room) return;

    await room.leave();
    this.rooms.delete(name);
  }

  public async reconnect(roomId: string, sessionId: string): Promise<void> {
    this.client.reconnect(roomId, sessionId);
  }
}
