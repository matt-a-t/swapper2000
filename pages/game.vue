<script setup>
const route = useRoute();
const gameCode = ref(route.query.code);
const game = ref(null);
const name = ref(null);
const player = ref(null);
const entry = ref(null);

// if we get the code from the URL, fetch the game
if (gameCode.value) {
  fetchGame();
}

// fetch the game status and set state
async function fetchGame() {
  const response = await $fetch("api/game", {
    method: "GET",
    query: {
      code: gameCode.value,
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok.");
  }
  if (!!response.game) {
    game.value = response.game;
  }
}

// join the game with proivded name
async function joinGame() {
  const response = await $fetch("api/join-game", {
    method: "POST",
    body: {
      code: gameCode.value,
      name: name.value,
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok.");
  }
  navigateTo(`game?code=${gameCode.value}`);
}

// set the entry for the player
function setEntry(entry) {
  entry.value = entry;
}
</script>

<template>
  <main>
    <FindGame v-if="!game" :handleSubmit="fetchGame" :gameCode="gameCode" />
    <PickName v-if="game && !player" :handleSubmit="joinGame" :name="name" />
    <MakeEntry
      v-if="game && player && !entry"
      :game="game"
      :player="player"
      :setEntry="setEntry"
    />
    <Results
      v-if="game && player && entry"
      :game="game"
      :player="player"
      :entry="entry"
    />
  </main>
</template>
