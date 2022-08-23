<script setup lang="ts">
import { reactive, ref } from "vue";
import { sound } from "@pixi/sound";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

import { network } from "@app";

const router = useRouter();
const loading = ref(false);
const aboutDialog = ref(false);
const soundEnabled = ref(true);
const aboutDialogCollapseItems = ref([]);
const joinMatchDialog = ref(false);
const dialogForm = reactive({
  matchId: "",
});

await network.joinLobby();

sound.play("background_drums");

let room = ref(network.rooms.get("lobby"));

// @todo: this seems like a weird way to do "play_again", maybe work on something better?
if (router.currentRoute.value.params.mode === "quick_play") play("quick_play");

function pauseSound(): void {
  sound.muteAll();
  soundEnabled.value = false;
}

function playSound(): void {
  sound.unmuteAll();
  soundEnabled.value = true;
}

async function play(
  mode: "quick_play" | "create_match" | "join_match",
  matchId?: string
): Promise<void> {
  loading.value = true;
  await network.leaveRoom("lobby");

  try {
    switch (mode) {
      case "quick_play":
        await network.joinMatch();
        break;
      case "create_match":
        await network.createPrivateMatch();
        break;
      case "join_match":
        if (!matchId) throw new Error("No match ID provided");
        await network.joinPrivateMatch(matchId);
        break;
      default:
        await network.joinMatch();
        break;
    }
  } catch (error) {
    ElMessage.error("Could not connect to match");
    dialogForm.matchId = "";

    // ? For some reason, if we leave the "lobby" room AFTER a failed connection to
    //   a "match" room, next time we successfully connect, events won't be triggered
    //   on the "match" room. Workaround is to first leave "lobby", then if "match"
    //   failed to connect, we reconnect to "lobby". This will connect to a new "lobby" room
    await network.joinLobby();
    room.value = network.rooms.get("lobby");

    return;
  }

  sound.play("selection");

  loading.value = false;
  await router.replace({ name: "Match" });
}
</script>

<template>
  <div
    v-loading.fullscreen.lock="loading"
    element-loading-text="Loading..."
    element-loading-background="rgba(0, 0, 0, 0.7)"
  >
    <el-row>
      <el-col :span="24">
        <div class="grid-content">
          <img
            src="/img/viking_ball_logo.png"
            alt="Viking Ball"
            id="viking-ball-logo"
          />
        </div>
      </el-col>
    </el-row>
    <el-row id="menu-row">
      <el-col>
        <div class="grid-content">
          <button @click="play('quick_play')" class="menu-button">
            Quick Play
          </button>
        </div>
      </el-col>
      <el-col>
        <div class="grid-content">
          <button @click="play('create_match')" class="menu-button">
            Create Match
          </button>
        </div>
      </el-col>
      <el-col>
        <div class="grid-content">
          <button @click="joinMatchDialog = true" class="menu-button">
            Join Match ID
          </button>
        </div>
      </el-col>
      <el-col>
        <div class="grid-content">
          <button @click="pauseSound()" v-if="soundEnabled" class="menu-button">
            Sound: ON
          </button>
          <button @click="playSound()" v-if="!soundEnabled" class="menu-button">
            Sound: OFF
          </button>
        </div>
      </el-col>
      <el-col>
        <div class="grid-content">
          <button class="menu-button" @click="aboutDialog = true">About</button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div class="grid-content">
          <p>
            A game by
            <a href="https://www.pixieinteractive.io/" target="_blank">
              Pixie Interactive
            </a>
          </p>
        </div>
      </el-col>
    </el-row>

    <el-dialog v-model="joinMatchDialog" title="Join Match" width="30%">
      <el-form :model="dialogForm">
        <el-form-item label="Match ID">
          <el-input v-model="dialogForm.matchId" autocomplete="off" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="joinMatchDialog = false">Cancel</el-button>
          <el-button
            type="primary"
            @click="play('join_match', dialogForm.matchId)"
          >
            Join
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="aboutDialog"
      :custom-class="'text-dialog'"
      title="Welcome to Viking Ball!"
    >
      <el-row>
        <el-col>
          <p>
            Viking Ball is a minigame built to be part of Northern Guilds, and
            as such, made to test the implementations of different mechanics and
            tools that will be incorporated into the final game.
          </p>
          <el-collapse v-model="aboutDialogCollapseItems">
            <el-collapse-item title="Controls" name="1">
              <div><b>WASD or Arrow Keys | </b>Move your character</div>
              <div><b>Spacebar | </b>Kick or tackle</div>
              <div><b>Shift | </b>Run</div>
              <div><b>ESC/Escape | </b>Open settings menu</div>
              <div><b>Mouse wheel | </b>Zoom in/out</div>
            </el-collapse-item>
            <el-collapse-item title="The match" name="2">
              <div>
                A match consists of two players, one on each side of the field.
                The objective is to score more goals than your opponent in order
                to win, each goal scores <i>one</i> point. If a player reaches
                the maximum score, they are declared the winner of the match.
              </div>
              <div>
                The duration of the match is shown at the top of the screen,
                once that number reaches <i>0</i>, the match is over and a
                winner is drawn. If the score is the same for both players, the
                match results in a tie.
              </div>
            </el-collapse-item>
            <el-collapse-item title="Quick Play" name="3">
              <div>
                Choosing "Quick Play" will either put you on an existing match
                against another player or create a new match. If a new match is
                created, you'll be placed in a "Waiting Room" where you can
                familiarize yourself with the controls before the match begins.
                Once another player connects to your match, the game begins.
              </div>
            </el-collapse-item>
            <el-collapse-item title="Create Match" name="4">
              <div>
                Choosing "Create Match" will create a private match where other
                players can <i>only</i> join if they provide the Match ID. You
                can see your Match ID by pressing <b>ESC/Escape</b> and opening
                the menu.
              </div>
              <div>
                You will be placed in a "Waiting Room" until another player
                joins your match.
              </div>
            </el-collapse-item>
            <el-collapse-item title="Join Match ID" name="5">
              <div>
                Choosing "Join Match ID" will open a dialog prompting you for a
                Match ID. Here you'll be able to join a private match created by
                another player.
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<style scoped>
.el-row {
  margin-bottom: 3%;
}
.el-row:last-child {
  margin-bottom: 0;
}

.el-icon {
  margin-top: 36px;
}

.grid-content {
  min-height: 36px;
  text-align: center;
}

.fullscreen {
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center center;
  background-image: url(/img/viking_ball_bg.png);
}

.menu-button {
  min-width: 40%;
}

.menu-button > .el-icon {
  margin: 0;
  vertical-align: middle;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

#menu-row > .el-col {
  margin-bottom: 1%;
}

#viking-ball-logo {
  margin-top: 1%;
  max-width: 300px;
}
</style>
