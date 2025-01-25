<template>
  <h1>
    <slot />
  </h1>
</template>

<style>
h1 {
  background: #f89513;
  font-size: 4em;
  padding: 0.5em;
  text-decoration: underline;
  border: 10px solid #333331;
  border-radius: 30px;
  margin: 0;
  @media (max-width: 600px) {
    font-size: 2.5em;
  }
}
</style>
