<script setup>
const props = defineProps({
  game: Object,
  player: Object,
  entry: Object,
  swap: Object,
});
const { entry, swap, game, player: currentPlayer } = toRefs(props);

const showResults = computed(() => {
  return game.value.entries_done && swap.value?.player_guess_id;
});
</script>

<template>
  <div class="box" v-if="swap">
    <Swap v-if="swap" :swap="swap" title="Your swap is in!" />
  </div>
  <div class="box" v-if="!showResults">
    <Swap :swap="entry" title="Your entry" />
  </div>
  <div v-else class="box">
    <h2>Results</h2>
    <ul>
      <li v-for="player in game.players" :key="player.id">
        <img src="/Cat Player Logo.png" alt="" />
        <Swap
          :swap="game.entries.find((p) => p.player_id === player.id)"
          :title="player.name"
        />
        <GuessIndicator
          :guessed="player.id == swap?.player_guess_id"
          :right="player.id == swap?.player_id"
        />
        <!-- <TheirGuess
          v-if="currentPlayer.id != swap?.player_id"
          :player="player"
        /> -->
        <!-- <h3>{{ player.name }}</h3>
        <p>{{ player.entry.album_name }} by {{ player.entry.artist_name }}</p>
        <p>Favorite track: {{ player.entry.song_name }}</p>
        <p>{{ player.entry.comment }}</p>
        <a :href="player.entry.link" target="_blank">{{ player.entry.link }}</a> -->
      </li>
    </ul>
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
