export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch {
      return localStorage.getItem(key) || defaultValue;
    }
  },
  set: (key, value) => {
    try {
      const serialized = typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (e) {
      console.error("Storage set error:", e);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error("Storage remove error:", e);
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error("Storage clear error:", e);
    }
  },
};

export default storage;

