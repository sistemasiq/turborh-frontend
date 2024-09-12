/**
 * Set a new instance of the session storage, setting an item and its value
 * @param {String} key The name of the item to set
 * @param {String} value The value can be any type od data (array, object, digit etc...) but the session storage will call the toString method so, parse the value to a string
 */
export const setSessionStorageItem = (key,value) => {
    sessionStorage.setItem(key,JSON.stringify(value));
}

/**
 * Get an item from the session storage by its key
 * @param {String} key The name of the item to get
 * @returns {String} The value of the item if it exists, otherwise null, and you should parse the value to the needed type (array, object, digit etc...)
 */
export const getSessionStorageItem = (key) => {
     return sessionStorage.getItem(key);
} 

/**
 * Remove an specific item from the session storage by its key
 * @param {*} key 
 */
export const removeSessionStorageItem = (key) => {
    sessionStorage.removeItem(key);
}

/**
 * Clear all items from the session storage
 */
export const clearSessionStorage = (key) => {
    sessionStorage.clear(key);
}
