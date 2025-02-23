<script setup>
const props = defineProps(["game", "currentPlayer"]);
const { game, currentPlayer } = toRefs(props);

async function guess(guessedPlayer) {
  const response = await $fetch("api/guess", {
    method: "POST",
    body: {
      gameCode: game.value.code,
      playerId: currentPlayer.id,
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
  <div>
    <h2>Who was it?</h2>
    <ul class="wrap">
      <li v-for="player in game.players" :key="player.id" class="col">
        <img src="/Cat Player Logo.png" alt="" height="100px" width="100px" />
        {{ player.name }}
        <button @click="guess(player)">Guess</button>
      </li>
    </ul>
  </div>
</template>
