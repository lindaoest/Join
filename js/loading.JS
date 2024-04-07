let loadedContacts = [];
let tasks = [];
let logedInPerson = '';
let logedInGuest = 'Dear Guest';
let logedInAsGuest = false;
let logedInWithName = false;
logedInPerson = JSON.parse(localStorage.getItem('logedIn Person'));
logedInAsGuest = JSON.parse(localStorage.getItem('logedIn as Guest'));
logedInWithName = JSON.parse(localStorage.getItem('logedIn with Name'));
const STORAGE_TOKEN = '0SUZWQWFOE8PEF8QOE5A57VYG0N48AWXZYFBZWYB';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
/**
 * Asynchronously sets an item in the storage.
 * @param {string} key - the key of the item to set
 * @param {any} value - the value to set for the given key
 * @return {Promise<any>} a Promise that resolves to the response JSON
 */
async function setItem(key, value) {
	const payload = {key, value, token:STORAGE_TOKEN}
	return fetch(STORAGE_URL, {method: 'POST', body: JSON.stringify(payload)})
	.then(resp => resp.json())
}
/**
 * Asynchronously retrieves an item from the storage using the provided key.
 *
 * @param {string} key - The key of the item to retrieve.
 * @return {Promise} A Promise that resolves to the value of the retrieved item.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        // Verbesserter code
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}
/**
 * Asynchronously loads contacts from storage and handles potential errors.
 * @return {undefined} 
 */
async function loadContacts(){
  try {
  loadedContacts = JSON.parse(await getItem('loadedContacts'));
  } catch(e){
  console.error('Loading error:', e);
  }
}
/**
 * Asynchronously loads tasks from storage.
 * @return {Promise<void>} Resolves once tasks are loaded
 */
async function loadTasks() {
  tasks = JSON.parse(await getItem('tasks'));
}