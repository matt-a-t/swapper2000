<script setup>
const props = defineProps({
  game: Object,
  player: Object,
  entry: Object,
  swap: Object,
});
const emit = defineEmits(["refreshGame"]);
const { game, player, entry, swap, refreshGame } = toRefs(props);

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

  emit("refreshGame");
}
</script>

<template>
  <div class="box">
    <div class="row">
      <Swap v-if="swap" :swap="swap" title="Your swap is in!" />
      <Swap v-else :swap="entry" title="Your entry" />
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
