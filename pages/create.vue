<script setup>
async function handleSubmit(event) {
  const form = event.target;
  const formData = new FormData(form);

  const response = await $fetch("api/games", {
    method: "POST",
    body: {
      prompt: formData.get("prompt"),
      numPlayers: formData.get("numPlayers"),
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok.");
  }
  console.log("Game created!");

  navigateTo(`game?code=${response.code}`);
}
</script>

<template>
  <main>
    <Header>Create game</Header>

    <form @submit.prevent="handleSubmit">
      <label for="prompt">Theme?</label>
      <textarea id="prompt" name="prompt"></textarea>

      <label for="numPlayers">Number of players?</label>
      <input id="numPlayers" name="numPlayers" type="number" />

      <input type="submit" value="Create" />
    </form>
  </main>
</template>

<style>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1em;
  background: #f89513;
  padding: 1em;
  border: 10px solid #333331;
  border-radius: 30px;
}

label {
  font-size: 1.5em;
}

input[type="text"],
textarea {
  font-size: 1.5em;
  padding: 0.5em;
}

.radio-group {
  display: flex;
  gap: 1em;
}

button {
  background: #333331;
  color: #f89513;
  font-size: 2em;
  padding: 0.5em;
  border: 10px solid #f89513;
  border-radius: 30px;
  margin: 0;
}
</style>
