<script setup lang="ts">
const props = defineProps({
  guessed: Boolean,
  right: Boolean,
});

const { guessed, right } = toRefs(props);
</script>

<template>
  <div v-if="guessed || right">
    <span v-if="guessed && right">Nailed it 🎉</span>
    <span v-else-if="guessed">Your guess ❌</span>
    <span v-else-if="right">Who it was 🤯</span>
  </div>
</template>

<style scoped>
div {
  display: flex;
  justify-content: center;
  gap: 1rem;
  font-size: 1.5rem;
  background: #333331;
  color: #f89513;
  padding: 0.5rem;
  border-radius: 0.5rem;
}
</style>
