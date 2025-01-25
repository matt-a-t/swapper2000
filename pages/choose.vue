<template>
  <main>
    <Header>?Que quires?</Header>

    <div class="choose-buttons">
      <LinkButton href="create">Create a game</LinkButton>
      <LinkButton href="join">Join</LinkButton>
    </div>
  </main>
</template>

<style>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 4em;
}

.choose-buttons {
  display: flex;
  gap: 2em;
}
</style>
