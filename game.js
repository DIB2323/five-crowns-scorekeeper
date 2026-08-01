/*
=====================================================
Five Crowns Scorekeeper
game.js

Contains all game logic.
No HTML or screen updates belong in this file.
=====================================================
*/

const ROUNDS = [
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K"
];

let game = null;


/*---------------------------------------------------
    Create a new game
---------------------------------------------------*/
function createGame(playerNames) {

    game = {

        players: playerNames,

        currentRound: 0,

        scores: {},

        started: new Date().toISOString()

    };

    ROUNDS.forEach(round => {

        game.scores[round] = {};

        playerNames.forEach(player => {

            game.scores[round][player] = null;

        });

    });

    return game;
}


/*---------------------------------------------------
    Return current game
---------------------------------------------------*/
function getGame() {
    return game;
}


/*---------------------------------------------------
    Replace current game
---------------------------------------------------*/
function setGame(savedGame) {
    game = savedGame;
}


/*---------------------------------------------------
    Round list
---------------------------------------------------*/
function getRounds() {
    return ROUNDS;
}


/*---------------------------------------------------
    Current round
---------------------------------------------------*/
function getCurrentRoundIndex() {
    return game.currentRound;
}

function getCurrentRound() {
    return ROUNDS[game.currentRound];
}


/*---------------------------------------------------
    Wild card
---------------------------------------------------*/
function getWildCard(round) {

    switch (round) {

        case "J":
            return "Jacks";

        case "Q":
            return "Queens";

        case "K":
            return "Kings";

        default:
            return round + "s";

    }

}


/*---------------------------------------------------
    Player list
---------------------------------------------------*/
function getPlayers() {
    return game.players;
}


/*---------------------------------------------------
    Scores
---------------------------------------------------*/
function getScore(round, player) {

    return game.scores[round][player];

}


function setScore(round, player, score) {

    if (score === "") {

        game.scores[round][player] = null;
        return;

    }

    const value = Number(score);

    if (Number.isNaN(value)) {
        return;
    }

    game.scores[round][player] = value;

}


/*---------------------------------------------------
    Round complete?
---------------------------------------------------*/
function isRoundComplete(round) {

    return game.players.every(player =>
        game.scores[round][player] !== null
    );

}

/*---------------------------------------------------
    Navigation
---------------------------------------------------*/

/*---------------------------------------------------
    Move to next round
---------------------------------------------------*/
function nextRound() {

    if (game.currentRound < ROUNDS.length - 1) {
        game.currentRound++;
    }

}

/*---------------------------------------------------
    Totals
---------------------------------------------------*/
function getTotals() {

    const totals = {};

    game.players.forEach(player => {

        totals[player] = 0;

        ROUNDS.forEach(round => {

            const score = game.scores[round][player];

            if (score !== null) {
                totals[player] += score;
            }

        });

    });

    return totals;

}


/*---------------------------------------------------
    Current leader
---------------------------------------------------*/
function getLeader() {

    const totals = getTotals();

    let leader = null;
    let lowest = Number.MAX_SAFE_INTEGER;

    game.players.forEach(player => {

        if (totals[player] < lowest) {

            lowest = totals[player];
            leader = player;

        }

    });

    return leader;

}


/*---------------------------------------------------
    Game complete?
---------------------------------------------------*/
function isGameComplete() {

    return game.currentRound === ROUNDS.length - 1 &&
           isRoundComplete(getCurrentRound());

}