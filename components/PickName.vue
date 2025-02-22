<script setup>
const props = defineProps(["handleSubmit", "name"]);
</script>

<template>
  <Header>What's your name?</Header>
  <form @submit.prevent="props.handleSubmit">
    <label for="name">Name</label>
    <input id="name" name="name" type="text" />
    <input type="submit" value="Join" />
  </form>
</template>
