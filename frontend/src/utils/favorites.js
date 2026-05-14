const STORAGE_KEY = 'micasa_favorites';

const readFavorites = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const writeFavorites = (favorites) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
  }
};

export const getFavorites = () => readFavorites();

export const isFavorite = (id) => {
  if (!id) return false;
  return readFavorites().includes(id);
};

export const toggleFavorite = (id) => {
  if (!id) return false;
  const current = readFavorites();
  const exists = current.includes(id);
  const next = exists ? current.filter((item) => item !== id) : [...current, id];
  writeFavorites(next);
  return !exists;
};
