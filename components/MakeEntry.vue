<script setup>
const props = defineProps(["game", "player", "setEntry"]);

async function handleSubmit(event) {
  console.log("submitting");
  const form = event.target;
  const formData = new FormData(form);

  const response = await $fetch("api/swap", {
    method: "POST",
    body: {
      playerId: player.id,
      gameCode: game.code,
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

  props.setEntry(response.entry);
}
</script>

<template>
  <Header>Make your pick</Header>
  <form @submit.prevent="handleSubmit">
    <label for="album-name">Album name</label>
    <input id="album-name" name="album-name" type="text" />
    <input id="artist-name" name="artist-name" type="text" />
    <input id="song-name" name="song-name" type="text" />
    <input id="link" name="link" type="text" />
    <input id="comment" name="comment" type="text" />

    <input type="submit" value="SWAP!" />
  </form>
</template>
