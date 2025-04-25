<script setup>
const config = useRuntimeConfig();
const { code: queryCode, name: queryName } = useRoute().query;

const code = ref(queryCode);
const name = ref(queryName);

const joined = ref(false);

const { data: game, refresh } = await useAsyncData(`game:${code.value}`, () =>
  fetchGame(code.value)
);

const player = computed(() =>
  game.value?.players.find((p) => p.name === name.value)
);
const entry = computed(() => player.value?.entry);
const swap = computed(() => player.value?.swap);

async function handleGamecodeSubmit(event) {
  const form = event.target;
  const formData = new FormData(form);
  code.value = formData.get("game-code");
  navigateTo(`/game?code=${code.value}`);
  await refresh();
}

async function handleNameSubmit(event) {
  const form = event.target;
  const formData = new FormData(form);
  name.value = formData.get("name");

  navigateTo(`/game?code=${code.value}&name=${name.value}`);

  joinGame();
}

// join the game with proivded name
async function joinGame() {
  await $fetch(`${config.public.url}/api/join-game`, {
    method: "POST",
    body: {
      code: code.value,
      name: name.value,
    },
  })
    .then(() => {
      joined.value = true;
    })
    .catch((error) => {
      if (error.data.statusCode === 409) {
        window != undefined &&
        confirm(`${name.value} is already in the game. Is that you?`)
          ? (joined.value = true)
          : null;
      } else {
        console.error(error);
        alert("Something fucky happened...");
      }
    });

  await refresh();
}

if (name.value && code.value && !joined.value) {
  joinGame();
}

async function advanceGame() {
  const response = await $fetch("api/swap", {
    method: "POST",
    body: {
      gameCode: game.value.code,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok.");
  }

  refresh();
}
</script>

<template>
  <main>
    <FindGame v-if="!game" :handleSubmit="handleGamecodeSubmit" />

    <Results
      v-if="game && joined && entry"
      :game="game"
      :player="player"
      :entry="entry"
      :swap="swap"
      v-on:refresh-game="refresh"
    />

    <PickName
      v-if="game && !name"
      :handleSubmit="handleNameSubmit"
      :name="name"
    />
    <MakeEntry
      v-if="game && joined && !entry"
      :game="game"
      :player="player"
      v-on:refresh-game="refresh"
    />
    <Players
      :game="game"
      :currentPlayer="player"
      :swap="swap"
      v-on:refresh-game="refresh"
    />

    <div class="box" v-if="game">
      <div class="row">
        <div>
          <h2>Theme</h2>
          <p>{{ game.prompt }}</p>
        </div>
        <div class="right">
          <h3>Code</h3>
          <p>{{ game.code }}</p>
        </div>
      </div>
      <ShareButton :game="game" :entry="entry" />
    </div>

    <div class="box" v-if="game && player && game?.creator === player?.name">
      <p>Creator only: *that's you*</p>
      <button @click="advanceGame" v-if="!game?.entries_done">
        Start swap!
      </button>
    </div>
    <!-- {{ game }} -->
  </main>
</template>

<style scoped>
.row {
  line-height: 1;
  justify-content: space-between;
}
</style>
