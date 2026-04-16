interface CardData {
    symbol: string;
}

enum Difficulty {
    Easy = 4,
    Normal = 6,
    Hard = 8
}

let allCards = [
    'fa-php','fa-php',
    'fa-github','fa-github',
    'fa-java','fa-java',
    'fa-python','fa-python',
    'fa-docker','fa-docker',
    'fa-wordpress','fa-wordpress',
    'fa-jedi-order','fa-jedi-order',
    'fa-stack-overflow','fa-stack-overflow',
];

let cards: string[] = [];
let flippedCards: HTMLElement[] = [];

//DIFFICULTY
let pairCount: number = 6;
let difficulty: number = Difficulty.Normal;
const difficulties: Record<string, number> = {
    difEasy: Difficulty.Easy,
    difNormal: Difficulty.Normal,
    difHard: Difficulty.Hard
};

(document.getElementById("difNormal") as HTMLElement).classList.add("btn-primary");

//DIFFICULTY CLICKS
(document.getElementById("difficulty") as HTMLElement).addEventListener("click", function (event: Event): void {
    const target = event.target as HTMLElement;
    const button = target.closest("button") as HTMLButtonElement | null;
    if(!button) return; // damit nicht klick auf div

    if(matchCounter > 0 || moveTracker > 0) {
        alert("You already started a game! Please start a new game to change the difficulty.");
        return;
    }

    document.querySelectorAll("#difficulty button").forEach(btn => btn.classList.remove("btn-primary"));
    button.classList.add("btn-primary");

    difficulty = difficulties[button.id as keyof typeof difficulties] || Difficulty.Normal;
    pairCount = difficulty;

    const input = document.getElementById("pairInput") as HTMLInputElement;
    if (input) input.value = String(pairCount);

    highscoreKey = "memoryHighscore_" + difficulty;
    highscore = Number(localStorage.getItem(highscoreKey)) || 0;

    highscoreMessage.textContent = "Highscore: " + highscore;

    setupGame();
});

//INPUT ÜBERSCHREIBT DIFFICUTLY
(document.getElementById("pairInput") as HTMLInputElement).addEventListener("input", (e: Event) => {
    let value = Number((e.target as HTMLInputElement).value);

    const maxPairs = allCards.length / 2;

    if (value < 2) value = 2;
    if (value > maxPairs) value = maxPairs;

    pairCount = value;
});

//KARTEN WERDEN GEMISCHT
function shuffle(cards: string[]): void {
    cards.sort(() => Math.random() - 0.5);
}

//KARTEN ERSTELLEN
const gameboard = document.getElementById("game-board") as HTMLElement;

function setupGame(){
    gameboard.innerHTML = "";

    const input = document.getElementById("pairInput") as HTMLInputElement;
    pairCount = Number(input.value);

    cards = allCards.slice(0, pairCount * 2); //kopiert + kürzt
    shuffle(cards);
    console.log(cards);

    cards.forEach(symbol => {
        const card = document.createElement("div"); //card
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.addEventListener('click', flipCard);
        gameboard.appendChild(card);
    });

    updatePlayerText();
    updateCardColors();
}

// MESSAGES und TRACKER
let winningMessage = document.getElementById("winningMessage") as HTMLElement;
let matchesMessage = document.getElementById("matchesMessage") as HTMLElement;
let moveMessage = document.getElementById("moveMessage") as HTMLElement;
let highscoreMessage = document.getElementById("highscoreMessage") as HTMLElement;

let highscoreKey: string = "memoryHighscore_" + difficulty;
let highscore: number = Number(localStorage.getItem(highscoreKey)) || 0;

highscoreMessage.textContent = "Highscore: " + highscore;

const currentModeUI = document.getElementById("currentMode") as HTMLElement;
const currentPlayerUI = document.getElementById("currentPlayer") as HTMLElement;
const scoreP1UI = document.getElementById("scoreP1") as HTMLElement;
const scoreP2UI = document.getElementById("scoreP2") as HTMLElement;

let checkMatchProcess: number = 0;
let moveTracker: number = 0;
let matchCounter: number = 0;

//MULTIPLAYER
let multiplayer: boolean = false;
let currentPlayer: number = 1;
let scoreP1: number = 0;
let scoreP2: number = 0;

//MULTIPLAYER TOGGLE
(document.getElementById("toggleMultiplayer") as HTMLElement).addEventListener("click", () => {
    multiplayer = !multiplayer;
    resetGame();
});

//FARBE DER KARTEN IM MULTIPLAYER
function updateCardColors(): void {
    const allBoardCards = document.querySelectorAll(".card");

    allBoardCards.forEach((card) => {
        if (!multiplayer) {
            //card.classList.remove("bg-tertiary");
            document.documentElement.style.setProperty("--bs-primary", "#004D80");
            document.documentElement.style.setProperty("--bs-secondary", "#5db8d4");
            document.documentElement.style.setProperty("--bs-tertiary", "#a0d8e7");
            document.documentElement.style.setProperty("--bs-quaternary", "#79B6C7");
            return;
        }

        if (currentPlayer === 1) {
            document.documentElement.style.setProperty("--bs-primary", "#004D80");
            document.documentElement.style.setProperty("--bs-secondary", "#5db8d4");
            document.documentElement.style.setProperty("--bs-tertiary", "#a0d8e7");
            document.documentElement.style.setProperty("--bs-quaternary", "#79B6C7");
        } else {
            //card.classList.remove("bg-tertiary");
            document.documentElement.style.setProperty("--bs-primary", "#008062");
            document.documentElement.style.setProperty("--bs-secondary", "#5dd4b2");
            document.documentElement.style.setProperty("--bs-tertiary", "#a0e7dc");
            document.documentElement.style.setProperty("--bs-quaternary", "#79c7b6");
        }
    });
}

//TEST WECHSELT BEI PLAYER SWITCH
function updatePlayerText(): void {
    if (!multiplayer) {
        currentModeUI.textContent = "Singleplayer Mode";
        currentPlayerUI.textContent = "";

        //currentPlayerUI.classList.remove("text-tertiary");
        return;
    }

    currentModeUI.textContent = "Multiplayer Mode";
    currentPlayerUI.textContent = "Turn: Player " + currentPlayer;
    //currentPlayerUI.classList.add("text-tertiary");
}

//MULTIPLAYER SCORE UPDATE
function updateScores(): void {
    scoreP1UI.textContent = "Player 1: " + scoreP1;
    scoreP2UI.textContent = "Player 2: " + scoreP2;
}

//KARTE WIRD UMGEDREHT
function flipCard(event: Event): void {
    if (checkMatchProcess !== 0) return;

    const card = event.currentTarget as HTMLElement;

    if (
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
    ) {
        return;
    }

    card.classList.add("flipped");
    card.innerHTML = `<i class="fa-brands ${card.dataset.symbol}"></i>`;

    flippedCards.push(card);

    if (flippedCards.length >= 2) {
        checkMatchProcess = 1;
        checkMatch();
    }
}

//MATCH WIRD GECHWECKT
function checkMatch(): void {
    moveTracker++;
    moveMessage.textContent = moveTracker + " Moves";

    const symbol1 = flippedCards[0]?.dataset.symbol;
    const symbol2 = flippedCards[1]?.dataset.symbol;

    if (symbol1 && symbol2 && symbol1 === symbol2) {
        if (flippedCards[0]) {
            flippedCards[0].classList.remove("flipped");
            flippedCards[0].classList.add("matched");
        }
        if (flippedCards[1]) {
            flippedCards[1].classList.remove("flipped");
            flippedCards[1].classList.add("matched");
        }

        // MULTIPLAYER SCORE
        if (multiplayer) {
            if (currentPlayer === 1) scoreP1++;
            else scoreP2++;

            updateScores();
        }

        undoCards();

        matchCounter++;
        matchesMessage.textContent = matchCounter + " Matches";

        if (matchCounter >= cards.length / 2) {
            winningMessage.style.display = "block";

            (document.getElementById("moveMessageFinal") as HTMLElement).textContent =
                "You won in " + moveTracker + " moves!";

            highscoreKey = "memoryHighscore_" + difficulty;

            if (highscore === 0 || moveTracker < highscore) {
                highscore = moveTracker;
                localStorage.setItem(highscoreKey, highscore.toString());
            }

            highscoreMessage.textContent = "Highscore: " + highscore;
        }
    } else {
        setTimeout(() => {
            undoClicked();

            // PLAYER SWITCH
            if (multiplayer) {
                currentPlayer = (currentPlayer === 1) ? 2 : 1;
                currentPlayerUI.textContent = "Multiplayer: Player " + currentPlayer;
            }

            updatePlayerText();
            updateCardColors();

        }, 800);
    }
}

//KARTEN WERDEN WIEDER UMGEDREHT
function undoClicked(): void {
    if (flippedCards[0]) {
            flippedCards[0].classList.remove("flipped");
            flippedCards[0].innerHTML = "";
        }
    if (flippedCards[1]) {
        flippedCards[1].classList.remove("flipped");
        flippedCards[1].innerHTML = "";
    }
    undoCards();
}

function undoCards() {
    flippedCards = [];
    checkMatchProcess = 0;
}

//BUTTON NEUES GAME
(document.getElementById("newGame") as HTMLElement).addEventListener("click", resetGame);
(document.getElementById("newGame2") as HTMLElement).addEventListener("click", resetGame);


function resetGame(): void {
    checkMatchProcess = 0;
    flippedCards = [];
    moveTracker = 0;
    matchCounter = 0;

    currentPlayer = 1;
    scoreP1 = 0;
    scoreP2 = 0;
    updateScores();

    moveMessage.textContent = "0 Moves";
    matchesMessage.textContent = "0 Matches";

    winningMessage.style.display = "none";

    if (multiplayer) { currentPlayerUI.textContent = "Turn: Player 1";}

    const allBoardCards = document.querySelectorAll(".card");

    allBoardCards.forEach(card => {
        card.classList.remove("matched");
        (card as HTMLElement).textContent = "";
        //card.classList.remove("bg-tertiary");
    });

    setupGame();
    updateCardColors();
}

setupGame();
