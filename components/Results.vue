<script setup>
const router = useRouter();
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

  router.push("/game?code=" + game.value.code + "&name=" + player.value.name);
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

console.log(game.value);

if (game.value.entries_done) {
  getSwap();
}
</script>

<template>
  <Header>Results</Header>
  <div class="box">
    <h2>The theme:</h2>
    <p>{{ game.prompt }}</p>
  </div>
  <div class="box" v-if="swap">
    <h2>Your swap:</h2>
    <p>{{ swap.album_name }} by {{ swap.artist_name }}</p>
    <p>Favorite track: {{ swap.song_name }}</p>
    <p>{{ swap.comment }}</p>
    <a :href="swap.link" target="_blank">{{ swap.link }}</a>
  </div>
  <div class="box">
    <h2>Your entry:</h2>
    <p>{{ entry.album_name }} by {{ entry.artist_name }}</p>
    <p>Favorite track: {{ entry.song_name }}</p>
    <p>{{ entry.comment }}</p>
    <a :href="entry.link" target="_blank">{{ entry.link }}</a>
  </div>

  <div class="box" v-if="game.creator === player.name">
    <button @click="advanceGame">Start swap!</button>
  </div>
</template>
