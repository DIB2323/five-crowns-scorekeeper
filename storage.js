//----------------------------------------------------
// Storage
//----------------------------------------------------

const STORAGE_KEY = "fiveCrownsCurrentGame";
const HISTORY_KEY = "fiveCrownsHistory";

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
function loadHistory() {

    const data =
        localStorage.getItem(HISTORY_KEY);

    return data ? JSON.parse(data) : [];

}
function saveHistory(history) {

    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
    );

}
function addGameToHistory() {

    const history = loadHistory();

    history.unshift({

        date: new Date().toISOString(),

        players: [...game.players],

        winners: [...game.winners],

        winningScore: game.winningScore,

        totals: getTotals()

    });

    saveHistory(history);

}