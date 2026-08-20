const PLAYER_ID_KEY = "bruiloftquiz.playerId";
const PLAYER_NAME_KEY = "bruiloftquiz.playerName";

export function getStoredPlayer(): { id: string; name: string } | null {
  if (typeof window === "undefined") return null;
  const id = localStorage.getItem(PLAYER_ID_KEY);
  const name = localStorage.getItem(PLAYER_NAME_KEY);
  if (!id || !name) return null;
  return { id, name };
}

export function storePlayer(id: string, name: string) {
  localStorage.setItem(PLAYER_ID_KEY, id);
  localStorage.setItem(PLAYER_NAME_KEY, name);
}

export function clearStoredPlayer() {
  localStorage.removeItem(PLAYER_ID_KEY);
  localStorage.removeItem(PLAYER_NAME_KEY);
}
