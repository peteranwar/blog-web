export const isBrowser = () => typeof window !== 'undefined';

export const getFromLocalStorage = (key) => {
  return isBrowser() ? localStorage.getItem(key) : null;
};

export const setToLocalStorage = (key, value) => {
  if (isBrowser()) {
    localStorage.setItem(key, value);
  }
};