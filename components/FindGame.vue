<script setup>
const props = defineProps(["handleSubmit", "gameCode"]);
</script>
<template>
  <Header>Join a game</Header>
  <form @submit.prevent="props.handleSubmit">
    <label for="game-code">Game Code</label>
    <input
      id="game-code"
      name="game-code"
      type="text"
      :modelValue="gameCode"
      @update:modelValue="gameCode = $event"
    />
    <input type="submit" value="Join" />
  </form>
</template>
