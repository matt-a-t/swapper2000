<script setup>
const props = defineProps(["game", "currentPlayer", "swap"]);
const emit = defineEmits(["refreshGame"]);
const { game, currentPlayer, swap } = toRefs(props);

async function guess(guessedPlayer) {
  await $fetch("api/guess", {
    method: "POST",
    body: {
      gameCode: game.value.code,
      playerId: currentPlayer.value.id,
      guessedId: guessedPlayer.id,
    },
  })
    .then(() => {
      emit("refreshGame");
    })
    .catch((error) => {
      console.error(error.data);
      alert("Something fucky happened...");
    });
}
</script>

<template>
  <div class="box" v-if="swap && !swap.player_guess_id">
    <h2>Who was it?</h2>
    <ul class="wrap">
      <li v-for="player in game.players" :key="player.id" class="col">
        <img src="/Cat Player Logo.png" alt="" height="100px" width="100px" />
        {{ player.name }}
        <button
          v-if="player.name !== currentPlayer.name"
          @click="guess(player)"
        >
          Guess
        </button>
      </li>
    </ul>
  </div>
  <div class="box" v-else>
    <h2>Players</h2>
    <ul class="wrap">
      <li v-for="player in game.players" :key="player.id" class="col">
        <img src="/Cat Player Logo.png" alt="" />
        {{ player.id == currentPlayer?.id ? "You" : player.name }}
        <span v-if="player.id == swap?.player_guess_id">Guessed</span>
        <span v-if="game.entries.find((p) => p.player_id === player.id)">
          Swap submitted
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.box {
  max-width: 600px;
}
</style>
