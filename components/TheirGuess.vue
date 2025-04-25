<script setup lang="ts">
const props = defineProps({
  swap: Object,
  player: Object,
});

const { swap, player } = toRefs(props);
</script>

<template>
  <p>
    {{ player?.swap }}
  </p>
</template>
