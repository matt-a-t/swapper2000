<script setup>
const props = defineProps(["game", "player", "entry"]);
const { game, player, entry } = toRefs(props);
const swap = useState("swap");

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

  navigateTo("/game?code=" + game.value.code + "&name=" + player.value.name);
}

async function getSwap() {
  const response = await $fetch("api/swap", {
    method: "GET",
    query: {
      gameCode: game.value.code,
      playerId: player.value.id,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok.");
  }

  if (response.swap) {
    swap.value = response.swap;
  }
}

if (game.value.entries_done) {
  getSwap();
}
</script>

<template>
  <div class="box">
    <Header>Game code: {{ game.code }}</Header>
    <ShareButton :game="game" :entry="entry" />

    <div class="row">
      <Swap v-if="swap" :swap="swap" title="Your swap is in!" />
      <Swap v-else="swap" :swap="entry" title="Your entry" />

      <Players :game="game" :swap="swap" :currentPlayer="player" />
    </div>

    <h2>Theme</h2>
    <p>{{ game.prompt }}</p>

    <Swap v-if="swap" :swap="entry" title="Your entry" />

    <div class="box" v-if="game.creator === player.name">
      <p>Creator only: *that's you*</p>
      <button @click="advanceGame">Start swap!</button>
    </div>
  </div>
</template>

<style scoped>
ul {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

li {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
}
</style>
