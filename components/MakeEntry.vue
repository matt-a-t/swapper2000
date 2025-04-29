<script setup>
const props = defineProps(["game", "player"]);
const emit = defineEmits(["refreshGame"]);

async function handleSubmit(event) {
  console.log("submitting");
  const form = event.target;
  const formData = new FormData(form);

  const response = await $fetch("api/entry", {
    method: "POST",
    body: {
      playerId: props.player.id,
      gameCode: props.game.code,
      albumName: formData.get("album-name"),
      artistName: formData.get("artist-name"),
      songName: formData.get("song-name"),
      link: formData.get("link"),
      comment: formData.get("comment"),
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok.");
  }

  emit("refreshGame");
}
</script>

<template>
  <Header>Make your pick</Header>
  <div class="box">
    <h2>The theme:</h2>
    <p>{{ game.prompt }}</p>
  </div>
  <form @submit.prevent="handleSubmit">
    <label for="album-name">Album name</label>
    <input id="album-name" name="album-name" type="text" />

    <label for="artist-name">Artist name</label>
    <input id="artist-name" name="artist-name" type="text" />

    <label for="song-name">Song name</label>
    <input id="song-name" name="song-name" type="text" />

    <label for="link">Link</label>
    <input id="link" name="link" type="text" />

    <label for="comment">Comment</label>
    <input id="comment" name="comment" type="textarea" />

    <input type="submit" value="SWAP!" />
  </form>
</template>
