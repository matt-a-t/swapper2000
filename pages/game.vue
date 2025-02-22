<script setup>
const config = useRuntimeConfig();
const route = useRoute();
const gameCode = ref(route.query.code);
const game = useState("game");
const name = ref(route.query.name);
const player = useState("player");
const entry = useState("entry");

// http://localhost:3000/game?code=c6ej
// &name=matt%20c
// if we get the code from the URL, fetch the game
if (gameCode.value) {
  await fetchGame();
}

if (game.value && name.value) {
  await joinGame();
}

// fetch the game status and set state
async function fetchGame() {
  const response = await $fetch(`${config.public.url}/api/game`, {
    method: "GET",
    query: {
      code: gameCode.value,
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok.");
  }
  if (!!response.game) {
    game.value = response.game;
  }
}

async function fetchEntry() {
  console.log("fetching entry", player.value.id);
  const response = await $fetch(`${config.public.url}/api/entry`, {
    method: "GET",
    query: {
      code: gameCode.value,
      playerid: player.value.id,
    },
  });
  if (!response.ok && response.status !== 404) {
    throw new Error("Network response was not ok.");
  }
  if (!!response.entry) {
    entry.value = response.entry;
  }
}

async function handleGamecodeSubmit(event) {
  const form = event.target;
  const formData = new FormData(form);
  gameCode.value = formData.get("game-code");
  fetchGame();
}

async function handleNameSubmit(event) {
  const form = event.target;
  const formData = new FormData(form);
  const nameToUse = formData.get("name");
  name.value = nameToUse;

  joinGame();
}

// join the game with proivded name
async function joinGame() {
  const response = await $fetch(`${config.public.url}/api/join-game`, {
    method: "POST",
    body: {
      code: gameCode.value,
      name: name.value,
    },
  });
  if (!response.ok) {
    if (response.status === 409) {
      window != undefined &&
      confirm(`${name.value} is already in the game. Is that you?`)
        ? setPlayer(response.player)
        : null;
    } else {
      console.error(response);
      alert("Something fucky happened...");
    }
  }

  setPlayer(response.player);
}

// set the entry for the player
function setEntry(entry) {
  fetchEntry();
  entry.value = entry;
}

async function setPlayer(newPlayer) {
  console.log("setting player", newPlayer);
  player.value = newPlayer;
  await nextTick();
  fetchEntry();
}
</script>

<template>
  <main>
    <FindGame v-if="!game" :handleSubmit="handleGamecodeSubmit" />
    <PickName
      v-if="game && !player"
      :handleSubmit="handleNameSubmit"
      :name="name"
    />
    <MakeEntry
      v-if="game && player && !entry"
      :game="game"
      :player="player"
      :setEntry="setEntry"
    />
    <Results
      v-if="game && player && entry"
      :game="game"
      :player="player"
      :entry="entry"
    />
  </main>
</template>
