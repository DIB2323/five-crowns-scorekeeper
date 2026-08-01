//----------------------------------------------------
// Storage
//----------------------------------------------------

const STORAGE_KEY = "fiveCrownsCurrentGame";

function saveGame() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(getGame())
    );

}


function loadGame() {

    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        return null;
    }

    return JSON.parse(data);

}


function deleteSavedGame() {

    localStorage.removeItem(STORAGE_KEY);

}


function hasSavedGame() {

    return localStorage.getItem(STORAGE_KEY) !== null;

}