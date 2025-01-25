<template>
  <main>
    <Header>Create game</Header>

    <form>
      <label for="name">Name</label>
      <input type="text" id="name" name="name" />

      <label for="prompt">Anything to say?</label>
      <textarea id="prompt" name="prompt"></textarea>

      <div>
        <label for="type">Album, song, or artist?</label>

        <div class="radio-group">
          <input type="radio" id="type" name="type" value="album" checked />
          <label for="type">Album</label>
          <input type="radio" id="type" name="type" value="song" />
          <label for="type">Song</label>
          <input type="radio" id="type" name="type" value="artist" />
          <label for="type">Artist</label>
        </div>
      </div>

      <button>Create</button>
    </form>
  </main>
</template>

<style>
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
