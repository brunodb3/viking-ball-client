<script lang="ts">
import * as PIXI from "pixi.js";
import { onMounted } from "vue";
import { sound } from "@pixi/sound";

import { Network } from "@classes";

// @todo: add server connection status (like a little ball that changes colors?)
export const network = new Network();
export const pixiApp = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x223038,
});
</script>

<script setup lang="ts">
window.devicePixelRatio = 1;
PIXI.settings.RESOLUTION = 1;
PIXI.settings.ROUND_PIXELS = false;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

pixiApp.renderer.view.style.display = "block";
pixiApp.renderer.view.style.position = "absolute";

onMounted(() => {
  sound.volumeAll = 0.5;
  sound.add("ball_kick", "sounds/ball_kick.wav");
  sound.add("whistle_long", "sounds/whistle_long.wav");
  sound.add("tackle", "sounds/tackle.wav");
  sound.add("boo", "sounds/boo.mp3");
  sound.add("goal_net", "sounds/goal_net.mp3");
  sound.add("selection", { url: "sounds/selection.mp3", volume: 0.8 });
  sound.add("background_drums", {
    loop: true,
    url: "sounds/background_drums.mp3",
  });
  sound.add("applause", {
    loop: true,
    url: "sounds/applause.mp3",
    // ? Applause volume is too high, here we set it to 80% of the others
    volume: (0.5 * 80) / 100,
  });

  const loader = PIXI.Loader.shared;
  loader
    .add("ball", "img/ball.png")
    .add("goal", "img/goal.png")
    .add("board_ng", "img/board_ng.png")
    .add("board_pixie", "img/board_pixie.png")
    .add("field_sheet", "spritesheets/field.png")
    .add("viking_idle", "spritesheets/viking/idle.png")
    .add("viking_run", "spritesheets/viking/jog.png")
    .add("viking_run_alt", "spritesheets/viking/jog2.png")
    .add("viking_kick", "spritesheets/viking/big-kick.png")
    .add("viking_tackle", "spritesheets/viking/tackle.png")
    .add("field_background", "img/field_background.png")
    .load(() => {
      const pixiDiv = document.getElementById("pixi") as HTMLDivElement;
      pixiDiv.appendChild(pixiApp.view);
    });
});
</script>

<template>
  <el-config-provider>
    <div id="pixi" class="fullscreen"></div>
    <router-view id="interface" class="fullscreen" v-slot="{ Component }">
      <template v-if="Component">
        <suspense>
          <component :is="Component"></component>
          <template #fallback> Loading... </template>
        </suspense>
      </template>
    </router-view>
  </el-config-provider>
</template>

<style>
@font-face {
  font-family: "vikingFilled";
  src: url(/fonts/Sabo-Filled.otf);
}

@font-face {
  font-family: "vikingRegular";
  src: url(/fonts/Sabo-Regular.otf);
}

.fullscreen {
  top: 0;
  left: 0;
  position: fixed;
  min-width: 100%;
  min-height: 100%;
}

.message-dialog {
  text-align: center;
  --el-bg-color: rgba(0, 0, 0, 0.5);
}

.text-dialog {
  text-align: center;
  --el-bg-color: white;
}

.text-dialog > .el-dialog__header > .el-dialog__title {
  color: black;
}

.text-dialog > .el-dialog__body > .el-row > .el-col {
  text-align: left;
}

.text-dialog > .el-dialog__body > .el-row > .el-col > * {
  color: black;
  font-size: 1vw;
  -webkit-text-stroke-width: 0px;
  font-family: Arial, Helvetica, sans-serif;
}

#interface {
  z-index: 1000;
}

h1,
h2,
h3,
h4,
p {
  color: white;
  font-family: "vikingFilled";
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
}

h1 {
  font-size: 6vw;
}

h2 {
  font-size: 5vw;
}

h3 {
  font-size: 4vw;
}

h4 {
  font-size: 3vw;
}

p {
  font-size: 2vw;
}

a {
  color: inherit;
  -webkit-text-stroke-width: inherit;
  -webkit-text-stroke-color: inherit;
}

button {
  color: #eeddb6;
  cursor: pointer;
  text-align: center;
  font-size: xx-large;
  font-family: "vikingFilled";
  background-color: #433456;
  box-shadow: 2px 2px black;
}

button:hover {
  filter: brightness(85%);
}

.el-input,
.el-message__content,
.el-form-item__label,
.el-dialog__title {
  font-family: "vikingFilled";
  -webkit-text-stroke-width: 0px;
}
</style>
