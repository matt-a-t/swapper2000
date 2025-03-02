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
const entry = computed(() =>
  game.value?.entries.find((e) => e.player_id === player.value?.id)
);
const swap = computed(() => {
  if (!game.value?.entries_done) {
    return null;
  }
  const swapInfo =
    game.value?.swaps.find((s) => s.to_player_id === player.value?.id) || {};
  const swapEntry =
    game.value?.entries.find((e) => e.player_id === swapInfo.from_player_id) ||
    {};

  return {
    ...swapInfo,
    ...swapEntry,
  };
});

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
</script>

<template>
  <main>
    <FindGame v-if="!game" :handleSubmit="handleGamecodeSubmit" />
    <div class="box" v-else>
      <!-- <Players
        :game="game"
        :currentPlayer="player"
        :swap="swap"
      /> -->
      <h2>Game code: {{ game.code }}</h2>
      <ShareButton :game="game" :entry="entry" />
    </div>
    <div class="box" v-if="swap">
      <Swap v-if="swap" :swap="swap" title="Your swap is in!" />
    </div>
    <Players
      v-if="game"
      :game="game"
      :currentPlayer="player"
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
    <Results
      v-if="game && joined && entry"
      :game="game"
      :player="player"
      :entry="entry"
      :swap="swap"
      v-on:refresh-game="refresh"
    />
    <!-- {{ game }} -->
  </main>
</template>
