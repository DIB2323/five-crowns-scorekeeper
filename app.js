/*
=====================================================
Five Crowns Scorekeeper
app.js

User interface
=====================================================
*/


//----------------------------------------------------
// HTML references
//----------------------------------------------------

const setupScreen = document.getElementById("setupScreen");
const gameScreen = document.getElementById("gameScreen");

const startButton = document.getElementById("startButton");
const continueButton =
    document.getElementById("continueButton");

const currentRoundLabel =
    document.getElementById("currentRound");

const wildCardLabel =
    document.getElementById("wildCard");

     const dealerName =
    document.getElementById("dealerName");


const scoreGrid =
    document.getElementById("scoreGrid");

const message =
    document.getElementById("message");
const gameActions =
    document.getElementById("gameActions");
const playerInputs = [

    document.getElementById("player1"),
    document.getElementById("player2"),
    document.getElementById("player3"),
    document.getElementById("player4")

];

const abandonGameButton =
    document.getElementById("abandonGameButton");

const historyScreen =
    document.getElementById("historyScreen");

const historyButton =
    document.getElementById("historyButton");

const backButton =
    document.getElementById("backButton");

const leaderboard =
    document.getElementById("leaderboard");

const historyList =
    document.getElementById("historyList");

   

//----------------------------------------------------
// Start Game
//----------------------------------------------------

updateContinueButton();

startButton.addEventListener("click", startGame);

continueButton.addEventListener("click", () => {

    game = loadGame();

    showGameScreen();

    renderGame();

});

abandonGameButton.addEventListener(
    "click",
    newGame
);

historyButton.addEventListener(
    "click",
    showHistoryScreen
);

backButton.addEventListener(
    "click",
    showSetupScreen
);

function startGame() {

    message.textContent = "";

    const players = playerInputs
        .map(input => input.value.trim())
        .filter(name => name !== "");

    if (players.length < 2) {

        message.textContent =
            "Please enter at least two players.";

        return;

    }

    if (hasSavedGame()) {

        const ok = confirm(
            "Starting a new game will replace the current saved game.\n\nContinue?"
        );

        if (!ok) {
            return;
        }

        deleteSavedGame();

    }

    createGame(players);

    showGameScreen();

    renderGame();

}


//----------------------------------------------------
// Screen handling
//----------------------------------------------------

function showGameScreen() {

    setupScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    pageHeader.classList.add("hidden");

    updateAbandonGameButton();
}

function showSetupScreen() {

    gameScreen.classList.add("hidden");
    historyScreen.classList.add("hidden");

    setupScreen.classList.remove("hidden");

    playerInputs.forEach(input => {

        input.value = "";

    });

    updateContinueButton();

    pageHeader.classList.remove("hidden");

    updateAbandonGameButton();

}

function showHistoryScreen() {

    setupScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
    historyScreen.classList.remove("hidden");

    renderHistory();

}

//----------------------------------------------------
// Render game
//----------------------------------------------------

function renderGame() {

    const header =
    document.querySelector(".gameHeader");

if (game.complete) {

    header.style.display = "none";

}
else {

    header.style.display = "flex";

currentRoundLabel.textContent =
    getCurrentRound();

wildCardLabel.textContent =
    getWildCard(getCurrentRound());

dealerName.textContent =
    game.players[game.dealer];
}

    buildScoreTable();
    
const gameMessage =
    document.getElementById("gameMessage");

if (game.complete) {

    const heading =
    game.winners.length === 1
        ? "Winner"
        : "Winners";

gameMessage.innerHTML =
    `<h2>🏆 Game Complete</h2>
     <p>${heading}: <strong>${game.winners.join(", ")}</strong><br>
     Score: <strong>${game.winningScore}</strong></p>`;

    gameActions.innerHTML =
        `<button id="newGameButton">
            New Game
        </button>`;

    document
        .getElementById("newGameButton")
        .addEventListener(
            "click",
            showSetupScreen
        );

}
else {

    gameMessage.innerHTML = "";
    gameActions.innerHTML = "";

}
}


//----------------------------------------------------
// Build score table
//----------------------------------------------------

function buildScoreTable() {

    const rounds = getRounds();
    const players = getPlayers();
    const totals = getTotals();

    let html = "<table>";

    // Header row

    html += "<tr>";
    html += "<th>Round</th>";

    players.forEach(player => {
        html += `<th>${player}</th>`;
    });

    html += "</tr>";

    // Score rows

    rounds.forEach(round => {

        const current =
            round === getCurrentRound()
                ? "currentRound"
                : "";

        html += `<tr class="${current}">`;

  const marker =
    round === getCurrentRound()
        ? "&#9654; "
        : "&nbsp;&nbsp;&nbsp;";

html += `<td class="roundLabel">${marker}${round}</td>`;

        players.forEach(player => {

const score = getScore(round, player);

const value =
    score === null ? "" : score;

const currentIndex = getCurrentRoundIndex();
const roundIndex = rounds.indexOf(round);

const disabled =
    game.complete || roundIndex > currentIndex
        ? "disabled"
        : "";
        
html += `
<td>
<input
    class="scoreInput"
    type="number"
    min="0"
    value="${value}"
    data-round="${round}"
    data-player="${player}"
    ${disabled}
>
</td>`;

        });

        html += "</tr>";

    });

    // Totals row

    html += '<tr class="totalRow">';
    html += "<td>Total</td>";

    players.forEach(player => {

        html += `<td>${totals[player]}</td>`;

    });

    html += "</tr>";

    html += "</table>";

    scoreGrid.innerHTML = html;

    attachScoreEvents();

}
//----------------------------------------------------
// Score events
//----------------------------------------------------

function attachScoreEvents() {

    const inputs =
        document.querySelectorAll(".scoreInput");

   inputs.forEach(input => {

    input.addEventListener("input", scoreChanged);

    input.addEventListener("keydown", handleKeyDown);

    input.addEventListener("focus", () => {
        input.select();
    });

});

}


//----------------------------------------------------
// Score changed
//----------------------------------------------------

function scoreChanged(event) {

    const input = event.target;

    const round =
        input.dataset.round;

    const player =
        input.dataset.player;

    setScore(
        round,
        player,
        input.value
    );

    updateTotals();

    saveGame();

}


//----------------------------------------------------
// Totals
//----------------------------------------------------

function updateTotals() {

    const totals = getTotals();

    const totalCells =
        document.querySelectorAll(".totalRow td");

    const players = getPlayers();

    players.forEach((player, index) => {

        totalCells[index + 1].textContent =
            totals[player];

    });

}

//----------------------------------------------------
// Keyboard navigation
//----------------------------------------------------

function handleKeyDown(event) {

    switch (event.key) {

        case "Enter":

    event.preventDefault();

    if (isGameComplete()) {

    finishGame();

}
else if (isCurrentRoundComplete()) {

    nextRound();

    renderGame();

    focusCurrentRound();

}
else {

    moveHorizontal(event.target, 1);

}

    break;

case "ArrowRight":

    event.preventDefault();
    moveHorizontal(event.target, 1);
    break;

        case "ArrowLeft":
            event.preventDefault();
            moveHorizontal(event.target, -1);
            break;

        case "ArrowDown":
            event.preventDefault();
            moveVertical(event.target, 1);
            break;

        case "ArrowUp":
            event.preventDefault();
            moveVertical(event.target, -1);
            break;

    }

}


function moveToNextInput(currentInput) {

    const inputs = Array.from(
        document.querySelectorAll(".scoreInput")
    );

    const index = inputs.indexOf(currentInput);

    if (index === -1) {
        return;
    }

    if (index < inputs.length - 1) {

        inputs[index + 1].focus();

    }

}
//----------------------------------------------------
// Horizontal movement
//----------------------------------------------------

function moveHorizontal(currentInput, direction) {

    const inputs = Array.from(
        document.querySelectorAll(".scoreInput")
    );

    const index = inputs.indexOf(currentInput);

    const newIndex = index + direction;

    if (newIndex >= 0 && newIndex < inputs.length) {
        inputs[newIndex].focus();
    }

}


//----------------------------------------------------
// Vertical movement
//----------------------------------------------------

function moveVertical(currentInput, direction) {

    const round = currentInput.dataset.round;
    const player = currentInput.dataset.player;

    const rounds = getRounds();

    const row = rounds.indexOf(round);

    const newRow = row + direction;

    if (newRow < 0 || newRow >= rounds.length) {
        return;
    }

    const selector =
        `.scoreInput[data-round="${rounds[newRow]}"][data-player="${player}"]`;

    const next = document.querySelector(selector);

    if (next) {
        next.focus();
    }

}
function finishGame() {

    const totals = getTotals();

    let lowestScore = Number.MAX_SAFE_INTEGER;

    for (const player in totals) {

        if (totals[player] < lowestScore) {

            lowestScore = totals[player];

        }

    }

    const winners = [];

    for (const player in totals) {

        if (totals[player] === lowestScore) {

            winners.push(player);

        }

    }

    game.complete = true;
    game.winners = winners;
    game.winningScore = lowestScore;

    addGameToHistory();

    deleteSavedGame();

    updateContinueButton();

    renderGame();

    updateAbandonGameButton();

}
function isCurrentRoundComplete() {

    const round = ROUNDS[game.currentRound];

    return game.players.every(player =>
        game.scores[round][player] !== null
    );

}
function updateContinueButton() {

    continueButton.style.display =
        hasSavedGame() ? "block" : "none";

}
function focusCurrentRound() {

    const firstInput = document.querySelector(
        ".currentRound .scoreInput"
    );

    if (firstInput) {

        firstInput.focus();

        firstInput.select();

    }

}
function newGame() {

    if (!confirm(
        "Abandon current game?\n\n" +
        "Your current scores will be lost."
    )) {

        return;

    }

   deleteSavedGame();

game = null;

showSetupScreen();

}
function updateAbandonGameButton() {

    if (game && !game.complete) {

        abandonGameButton.style.display = "inline-block";

    }
    else {

        abandonGameButton.style.display = "none";

    }

}
function renderHistory() {

    const history = loadHistory();

    if (history.length === 0) {

        leaderboard.innerHTML =
            "<p>No games played yet.</p>";

        historyList.innerHTML = "";

        return;

    }

    const stats = {};

    history.forEach(game => {

        game.players.forEach(player => {

            if (!stats[player]) {

                stats[player] = {
                    games: 0,
                    wins: 0,
                    totalScore: 0
                };

            }

            stats[player].games++;
            stats[player].totalScore += game.totals[player];

        });

        game.winners.forEach(player => {

            stats[player].wins++;

        });

    });

    const players =
        Object.entries(stats)
            .sort((a, b) => b[1].wins - a[1].wins);

    let html =
        "<h3>Leaderboard</h3><table>";

    html +=
        "<tr><th>Player</th><th>Wins</th><th>Games</th><th>Average</th></tr>";

    players.forEach(([player, s], index) => {

        const crown =
            index === 0 ? "👑 " : "";

        const average =
            (s.totalScore / s.games).toFixed(1);

        html += `
            <tr>
                <td>${crown}${player}</td>
                <td>${s.wins}</td>
                <td>${s.games}</td>
                <td>${average}</td>
            </tr>`;
    });

    html += "</table>";

    leaderboard.innerHTML = html;

    html = "<h3>Recent Games</h3>";

    history.forEach(game => {

        const date =
            new Date(game.date)
                .toLocaleDateString(
                    "en-AU",
                    {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    }
                );

        html += `
            <div class="historyCard">
                <strong>${date}</strong><br>
                Winner: ${game.winners.join(", ")}
                (${game.winningScore})
            </div>`;
    });

    historyList.innerHTML = html;

}