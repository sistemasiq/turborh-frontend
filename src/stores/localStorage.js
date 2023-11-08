import { defineStore } from "pinia";
import { useQuasar } from "quasar";


export const useLocalStorageStore = defineStore("localStorage", () => {
  
  const save = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const load = (key) => {

    return JSON.parse(localStorage.getItem(key));
  };

  const setLoadedItem = (key, item) => {

    const loadedItem = load(key);

    if(loadedItem){
      item = loadedItem;
    }

  }
  

  const remove = (key) => localStorage.removeItem(key);

  const clear = () => localStorage.clear();

  return {
    save,
    load,
    setLoadedItem,
    remove,
    clear
  };
});
