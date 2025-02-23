<script setup>
const props = defineProps(["swap", "title"]);
const { swap, title } = toRefs(props);
</script>

<template>
  <div v-if="swap">
    <h2>{{ title }}</h2>
    <p>{{ swap.album_name }} by {{ swap.artist_name }}</p>
    <p>Favorite track: {{ swap.song_name }}</p>
    <p>{{ swap.comment }}</p>
    <a :href="swap.link" target="_blank">{{ swap.link }}</a>
  </div>
</template>
