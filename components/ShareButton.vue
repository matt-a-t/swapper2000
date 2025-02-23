<script setup>
const props = defineProps(["game", "entry"]);
const config = useRuntimeConfig();
const { game, entry } = toRefs(props);
const copied = ref(false);

function copyLink() {
  copied.value = true;
  const link = `${config.public.url}/game?code=${game.value.code}`;
  navigator.clipboard.writeText(link);
}
</script>
<template>
  <button @click="copyLink">Share Game</button>
  <span v-if="copied">Copied! Go paste it somewhere!</span>
</template>
