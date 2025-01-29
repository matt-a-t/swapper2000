<script setup>
const props = defineProps(["game", "player", "entry"]);
</script>

<template>
  <Header>Results</Header>
  <p>{{ game }} {{ player }} {{ entry }}</p>
</template>
