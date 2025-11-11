function setStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getStorage(key: string) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function removeStorage(key: string) {
  localStorage.removeItem(key);
}

function logLocalStorage() {
  console.log(localStorage);
}

export { setStorage, getStorage, removeStorage, logLocalStorage };