export default async function fetchGame(code: string) {
  const { game, ok } = await $fetch(`/api/game?code=${code}`);
  if (!ok) {
    throw new Error('Game not found');
  }
  return game;
}