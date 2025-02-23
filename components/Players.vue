<script setup>
const props = defineProps(["game", "currentPlayer", "swap"]);
const { game, currentPlayer, swap } = toRefs(props);

async function guess(guessedPlayer) {
  console.log(currentPlayer);
  const response = await $fetch("api/guess", {
    method: "POST",
    body: {
      gameCode: game.value.code,
      playerId: currentPlayer.value.id,
      guessedId: guessedPlayer.id,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok.");
  }

  navigateTo("/results?code=" + game.value.code + "&player=" + player.id);
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
        {{ player.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.box {
  max-width: 600px;
}
</style>
