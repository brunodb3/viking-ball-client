<script setup lang="ts">
// @todo: only show GUI if developer mode is enabled
// import { GUI } from "dat.gui";
import { Room } from "colyseus.js";
import { sound } from "@pixi/sound";
import { useRouter } from "vue-router";
import { Viewport } from "pixi-viewport";
import { ElMessage } from "element-plus";
import { ref, onBeforeUnmount } from "vue";
import { Container, DisplayObject } from "pixi.js";

import { pixiApp, network } from "@app";
import { IPlayerInput } from "@interfaces";
import { Ball, Field, Goal, Actions, Movement, Player } from "@classes";
import { Match as MatchSchema, Player as PlayerSchema } from "@schemas";

const room: Room<MatchSchema> = network.rooms.get("match")!;

// const gui = new GUI();
const router = useRouter();

// const cameraFolder = gui.addFolder("Camera Stuff");
// const settingsFolder = gui.addFolder("Settings Stuff");
// const ballSettingsFolder = gui.addFolder("Ball Stuff");
// const matchSettingsFolder = gui.addFolder("Match Stuff");
// const playerSettingsFolder = gui.addFolder("Player Stuff");

// const ballInterpolationSettingsFolder =
//   ballSettingsFolder.addFolder("Interpolation");
// const animationSettingsFolder = playerSettingsFolder.addFolder("Animations");
// const playerInterpolationSettingsFolder =
//   playerSettingsFolder.addFolder("Interpolation");
// const matchConstraintSettingsFolder =
//   matchSettingsFolder.addFolder("Ball Constraint");

const viewportZoom = {
  min: 0.5,
  max: 6,
};
const settings = {
  showServerDebug: false,
};

const ball = new Ball();
const field = new Field();
const scene = new Container();
const actions = new Actions({ onAction, onMenu });
const movement = new Movement({ onMove });
const players: Map<string, Player> = new Map();
const goals = {
  left: new Goal("left"),
  right: new Goal("right"),
};
const viewport = new Viewport({
  worldWidth: 1500,
  worldHeight: 1500,
  disableOnContextMenu: true,
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
});

const volume = ref(50);
const time = ref("00:00");
const loading = ref(false);
const state = ref("WAITING");
const menuDialog = ref(false);
const helpDialog = ref(false);
const soundEnabled = ref(true);
const messageDialog = {
  show: ref(true),
  message: ref("Waiting for other players to join"),
};
const score = {
  left: ref(0),
  right: ref(0),
};

setup();

function setup(): void {
  if (!room) return;

  room.onMessage("score", onScore);
  room.onMessage("match_end", onEnd);
  room.onMessage("match_start", onStart);

  room.onStateChange(onStateChange);
  room.state.players.onAdd = onPlayerJoin;
  room.state.players.onRemove = onPlayerLeave;

  actions.listen();
  movement.listen();

  viewport.pinch().wheel().decelerate().clampZoom({
    minScale: viewportZoom.min,
    maxScale: viewportZoom.max,
  });

  viewport.scale.set(2.5);
  viewport.sortableChildren = true;

  field.zIndex = 1;
  ball.zIndex = 10;
  goals.left.zIndex = 100;
  goals.right.zIndex = 100;

  ball.server.debug.zIndex = 50;
  field.server.debug.zIndex = 50;
  goals.left.server.debug.zIndex = 50;
  goals.right.server.debug.zIndex = 50;

  viewport.addChild(field, ball, goals.left, goals.right);

  scene.addChild(viewport);

  pixiApp.stage.addChild(scene);

  setupGui();

  // ? Call resize at least once
  onResize();
  window.addEventListener("resize", onResize);
}

function setupGui(): void {
  // gui.close();
  // settingsFolder.add(settings, "showServerDebug").onChange((value) => {
  //   if (value) {
  //     addViewportChild(ball.server.debug);
  //     addViewportChild(field.server.debug);
  //     addViewportChild(goals.left.server.debug);
  //     addViewportChild(goals.right.server.debug);
  //     players.forEach((player) => {
  //       addViewportChild(player.server.debug);
  //     });
  //   } else {
  //     removeViewportChild(ball.server.debug);
  //     removeViewportChild(field.server.debug);
  //     removeViewportChild(goals.left.server.debug);
  //     removeViewportChild(goals.right.server.debug);
  //     players.forEach((player) => {
  //       removeViewportChild(player.server.debug);
  //     });
  //   }
  // });
  // cameraFolder.add(viewportZoom, "min", 0.1, 5, 0.1).onChange((value) => {
  //   viewport.clampZoom({
  //     minScale: value,
  //     maxScale: viewportZoom.max,
  //   });
  // });
  // cameraFolder.add(viewportZoom, "max", 5, 10, 0.1).onChange((value) => {
  //   viewport.clampZoom({
  //     minScale: viewportZoom.min,
  //     maxScale: value,
  //   });
  // });
  // ballSettingsFolder
  //   .add({ forceMagnitude: 0.0008 }, "forceMagnitude", 0.0001, 0.001, 0.0001)
  //   .onChange((value) => {
  //     onBallSettingChange({ forceMagnitude: value });
  //   });
  // ballSettingsFolder
  //   .add({ kickForce: 5 }, "kickForce", 1, 100, 1)
  //   .onChange((value) => {
  //     onBallSettingChange({ kickForce: value });
  //   });
  // playerSettingsFolder
  //   .add({ forceMagnitude: 0.0008 }, "forceMagnitude", 0.0001, 0.001, 0.0001)
  //   .onChange((value) => {
  //     onPlayerSettingChange({ forceMagnitude: value });
  //   });
  // playerSettingsFolder
  //   .add({ runningMultiplier: 1.5 }, "runningMultiplier", 1, 5, 0.1)
  //   .onChange((value) => {
  //     onPlayerSettingChange({ runningMultiplier: value });
  //   });
  // playerSettingsFolder
  //   .add({ velocityThreshold: 0.01 }, "velocityThreshold", 0.001, 0.5, 0.001)
  //   .onChange((value) => {
  //     onPlayerSettingChange({ velocityThreshold: value });
  //   });
  // animationSettingsFolder
  //   .add({ runSpeed: 0.08 }, "runSpeed", 0.01, 1, 0.01)
  //   .onChange((value) => {
  //     onPlayerSettingChange({ animations: { run: { multiplier: value } } });
  //   });
  // animationSettingsFolder
  //   .add({ idleSpeed: 0.08 }, "idleSpeed", 0.01, 1, 0.01)
  //   .onChange((value) => {
  //     onPlayerSettingChange({ animations: { idle: { multiplier: value } } });
  //   });
  // animationSettingsFolder
  //   .add({ kickSpeed: 0.08 }, "kickSpeed", 0.01, 1, 0.01)
  //   .onChange((value) => {
  //     onPlayerSettingChange({ animations: { kick: { multiplier: value } } });
  //   });
  // animationSettingsFolder
  //   .add({ kickDuration: 1000 }, "kickDuration", 0, 5000, 1)
  //   .onChange((value) => {
  //     onPlayerSettingChange({ animations: { kick: { duration: value } } });
  //   });
  // animationSettingsFolder
  //   .add({ tackleSpeed: 0.08 }, "tackleSpeed", 0.01, 1, 0.01)
  //   .onChange((value) => {
  //     onPlayerSettingChange({ animations: { tackle: { multiplier: value } } });
  //   });
  // animationSettingsFolder
  //   .add({ tackleDuration: 1000 }, "tackleDuration", 0, 5000, 1)
  //   .onChange((value) => {
  //     onPlayerSettingChange({ animations: { tackle: { duration: value } } });
  //   });
  // ballInterpolationSettingsFolder
  //   .add({ enabled: true }, "enabled")
  //   .onChange((value) => {
  //     ball.settings.interpolation.enabled = value;
  //   });
  // ballInterpolationSettingsFolder
  //   .add({ rate: 0.5 }, "rate", 0, 1, 0.1)
  //   .onChange((value) => {
  //     ball.settings.interpolation.rate = value;
  //   });
  // playerInterpolationSettingsFolder
  //   .add({ enabled: true }, "enabled")
  //   .onChange((value) => {
  //     players.forEach((player) => {
  //       player.settings.interpolation.enabled = value;
  //     });
  //   });
  // playerInterpolationSettingsFolder
  //   .add({ rate: 0.2 }, "rate", 0, 1, 0.1)
  //   .onChange((value) => {
  //     players.forEach((player) => {
  //       player.settings.interpolation.rate = value;
  //     });
  //   });
  // matchConstraintSettingsFolder
  //   .add({ activateDistance: 60 }, "activateDistance", 0, 100, 0.01)
  //   .onChange((value) => {
  //     onMatchSettingChange({ constraint: { activateDistance: value } });
  //   });
  // matchConstraintSettingsFolder
  //   .add({ offsetX: 25 }, "offsetX", 0, 100, 0.01)
  //   .onChange((value) => {
  //     onMatchSettingChange({ constraint: { offsetX: value } });
  //   });
  // matchConstraintSettingsFolder
  //   .add({ offsetY: 20 }, "offsetY", 0, 100, 0.01)
  //   .onChange((value) => {
  //     onMatchSettingChange({ constraint: { offsetY: value } });
  //   });
}

function onResize(): void {
  pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
}

function onMove(input: IPlayerInput): void {
  network.send("match", "input_move", input);
}

function onAction(): void {
  network.send("match", "input_action");

  if (room.state.ballPossession === room.sessionId) {
    sound.play("ball_kick");
  } else {
    sound.play("tackle");
  }
}

function onMenu(): void {
  sound.play("selection");
  menuDialog.value = !menuDialog.value;
}

// function onBallSettingChange(settings: {
//   kickForce?: number;
//   forceMagnitude?: number;
// }): void {
//   network.send("match", "ball_settings", settings);
// }

// function onPlayerSettingChange(settings: {
//   forceMagnitude?: number;
//   velocityThreshold?: number;
//   runningMultiplier?: number;
//   animations?: {
//     run?: {
//       multiplier?: number;
//     };
//     idle?: {
//       multiplier?: number;
//     };
//     kick?: {
//       duration?: number;
//       multiplier?: number;
//     };
//     tackle?: {
//       duration?: number;
//       multiplier?: number;
//     };
//   };
// }): void {
//   network.send("match", "player_settings", settings);
// }

// function onMatchSettingChange(settings: {
//   constraint?: {
//     offsetX?: number;
//     offsetY?: number;
//     activateDistance?: number;
//   };
// }): void {
//   network.send("match", "match_settings", settings);
// }

function onScore(): void {
  sound.play("goal_net");
  ElMessage.success(`score!`);
}

function onStart(): void {
  sound.play("applause");
  sound.play("whistle_long");
}

function onEnd(message: { winner: string; tie: boolean }): void {
  sound.play("whistle_long");
  messageDialog.message.value = "Match ended";

  if (message.tie) {
    messageDialog.message.value += " | Tie";
    return;
  }

  if (message.winner === room.sessionId) {
    messageDialog.message.value += " | You won";
    return;
  }

  messageDialog.message.value += " | You lost";
}

function onStateChange(data: MatchSchema): void {
  state.value = data.state;
  time.value = data.timeRemaining;
  messageDialog.show.value = !data.playing;

  ball.updateFromServer(data.ball);
  field.updateFromServer(data.field);
  goals.left.updateFromServer(data.goalLeft);
  goals.right.updateFromServer(data.goalRight);

  data.players.forEach((playerState, id) => {
    const player = players.get(id);
    if (!player) return;

    player.updateFromServer(playerState);

    if (playerState.side === "left") score.left.value = playerState.score;
    if (playerState.side === "right") score.right.value = playerState.score;
  });
}

function onPlayerJoin(data: PlayerSchema, id: string): void {
  const player = new Player({ pixiApp });
  player.position.set(data.position.x, data.position.y);

  players.set(id, player);

  player.zIndex = 50;
  player.server.debug.zIndex = 50;

  addViewportChild(player);
  if (settings.showServerDebug) addViewportChild(player.server.debug);

  if (id === room?.sessionId) {
    viewport.follow(player);
  }
}

function onPlayerLeave(_: PlayerSchema, id: string): void {
  const player = players.get(id);
  if (!player) return;

  removeViewportChild(player);
  removeViewportChild(player.server.debug);

  players.delete(id);
}

function onVolumeChange(value: number): void {
  sound.volumeAll = value / 100;
  // ? Applause volume is too high, here we set it to 80% of the others
  sound.volume("applause", (value * 80) / 100 / 100);
}

function removeViewportChild(child: DisplayObject): void {
  const index = viewport.children.findIndex((each) => each === child);

  if (index > -1) {
    viewport.removeChildAt(index);
  }
}

function addViewportChild(child: DisplayObject): void {
  const index = viewport.children.findIndex((each) => each === child);

  if (index < 0) {
    viewport.addChild(child);
  }
}

function pauseSound(): void {
  sound.muteAll();
  soundEnabled.value = false;
}

function playSound(): void {
  sound.unmuteAll();
  soundEnabled.value = true;
}

function matchIdToClipboard(): void {
  sound.play("selection");
  navigator.clipboard.writeText(room.id);
  ElMessage.success(`Copied match ID to clipboard!`);
}

async function leaveMatch(playAgain: boolean = false): Promise<void> {
  loading.value = true;

  sound.stop("applause");
  sound.stop("background_drums");

  sound.play("selection");

  await network.leaveRoom("match");

  loading.value = false;

  await router.replace({
    name: "Lobby",
    // @todo: this seems like a weird way to do "play_again", maybe work on something better?
    params: { mode: playAgain ? "quick_play" : undefined },
  });
}

onBeforeUnmount(() => {
  // ? Removes all listeners and cleans the Pixi stage
  //   so that users can hit "Play Again"
  // gui.destroy();
  actions.destroy();
  movement.destroy();
  pixiApp.stage.removeAllListeners();

  for (let i = pixiApp.stage.children.length - 1; i >= 0; i--) {
    pixiApp.stage.removeChild(pixiApp.stage.children[i]);
  }
});
</script>

<template>
  <div
    v-loading.fullscreen.lock="loading"
    element-loading-text="Loading..."
    element-loading-background="rgba(0, 0, 0, 0.7)"
  >
    <div id="joystick-area"></div>
    <el-row>
      <el-col :span="2">
        <div class="grid-content">
          <el-icon
            id="help-icon"
            :size="40"
            color="#ffffff"
            @click="helpDialog = true"
            ><QuestionFilled
          /></el-icon>
        </div>
      </el-col>
      <el-col :span="22">
        <div id="score" class="grid-content">
          <h4>{{ time }}</h4>
          <h4>{{ score.left.value }} | {{ score.right.value }}</h4>
        </div>
      </el-col>
    </el-row>

    <el-dialog v-model="menuDialog" title="Menu" :show-close="false" center>
      <el-row id="menu-row">
        <el-col>
          <div class="grid-content">
            <button class="menu-button" @click="matchIdToClipboard()">
              Match ID: {{ room.id }}
            </button>
          </div>
        </el-col>
        <el-col>
          <div class="grid-content">
            <button
              @click="pauseSound()"
              v-if="soundEnabled"
              class="menu-button"
            >
              Sound: ON
            </button>
            <button
              @click="playSound()"
              v-if="!soundEnabled"
              class="menu-button"
            >
              Sound: OFF
            </button>
          </div>
        </el-col>
        <el-col>
          <el-row id="volume-control" align="middle">
            <el-col :span="6"><p>Volume:</p></el-col>
            <el-col :span="18"
              ><el-slider v-model="volume" @input="onVolumeChange"
            /></el-col>
          </el-row>
        </el-col>
        <el-col>
          <div class="grid-content">
            <button class="menu-button" @click="leaveMatch()">
              Leave Match
            </button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog v-model="helpDialog" title="Help" :custom-class="'text-dialog'">
      <el-row>
        <el-col>
          <p>Controls</p>
          <div><b>WASD or Arrow Keys | </b>Move your character</div>
          <div><b>Spacebar | </b>Kick or tackle</div>
          <div><b>Shift | </b>Run</div>
          <div><b>ESC/Escape | </b>Open settings menu</div>
          <div><b>Mouse wheel | </b>Zoom in/out</div>
          <hr />
          <p>Objective</p>
          <div>Score more goals/points than your opponent to win the match</div>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog
      width="80"
      :modal="false"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :custom-class="'message-dialog'"
      v-model="messageDialog.show.value"
    >
      <el-row id="message-row" justify="center">
        <el-col :span="24">
          <h4>{{ messageDialog.message.value }}</h4>
        </el-col>
        <el-col v-if="state === 'END' || state === 'PLAYER_LEFT'">
          <div class="grid-content">
            <button @click="leaveMatch(true)" class="message-button">
              Play Again
            </button>
          </div>
        </el-col>
        <el-col v-if="state === 'END' || state === 'PLAYER_LEFT'">
          <div class="grid-content">
            <button @click="leaveMatch()" class="message-button">
              Leave Match
            </button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<style scoped>
#joystick-area {
  left: 0;
  bottom: 0;
  width: 50%;
  height: 100%;
  position: absolute;
}

#score > h4 {
  margin: 2px;
}

.grid-content {
  min-height: 36px;
  text-align: center;
}

.el-row {
  margin-bottom: 3%;
}

.el-row:last-child {
  margin-bottom: 0;
}

.menu-button {
  width: 100%;
}

.volume-control {
  width: 80%;
}

.message-button {
  width: 50%;
}

#menu-row > .el-col {
  margin-bottom: 1%;
}

#message-row > .el-col {
  margin-bottom: 1%;
}

#menu-row > .el-col:last-child {
  margin-top: 5%;
}

#help-icon {
  margin-top: 5%;
  cursor: pointer;
  z-index: 10000;
}
</style>
