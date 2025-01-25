<script setup>
const props = defineProps(["href"]);
</script>
<template>
  <a v-bind:href="props.href"><slot /></a>
</template>

<style>
a {
  background: #f89513;
  font-size: 2em;
  padding: 0.5em;
  border: 10px solid #333331;
  color: #333331;
  border-radius: 30px;
  margin: 0;
  text-decoration: none;
}
</style>
