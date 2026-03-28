
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
let flippedCards = [];

//DIFFICULTY
let difficulty = 12;
const difficulties = { difEasy: 8, difNormal: 12, difHard: 16 };

document.getElementById("difNormal").classList.add("btn-primary");

document.getElementById("difficulty").addEventListener("click", function(event){
    const button = event.target.closest("button");
    if(!button) return; // damit nicht klick auf div

    if(matchCounter > 0 || moveTracker > 0) {
        alert("You already started a game! Please start a new game to change the difficulty.");
        return;
    }

    document.querySelectorAll("#difficulty button").forEach(btn => btn.classList.remove("btn-primary"));
    button.classList.add("btn-primary");

    difficulty = difficulties[button.id];

    let highscoreKey = "memoryHighscore_" + difficulty;
    highscore = localStorage.getItem(highscoreKey) || 0;
    document.getElementById("highscoreMessage").textContent = "Highscore: " + highscore;

    setupGame();
});

//KARTEN WERDEN GEMISCHT
function shuffle(cards) {
    cards.sort(() => Math.random() - 0.5);
}

//KARTEN ERSTELLEN
const gameboard = document.getElementById("game-board");

function setupGame(){
    gameboard.innerHTML = "";

    cards = allCards.slice(0, difficulty); //kopiert + kürzt
    shuffle(cards);
    console.log(cards);

    cards.forEach(symbol => {
        const card = document.createElement("div"); //card
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.addEventListener('click', flipCard);
        gameboard.appendChild(card);
    });
}

//MESSAGES und TRACKER
let winningMessage = document.getElementById("winningMessage");
//let matchMessage = document.getElementById("matchMessage");
let matchesMessage = document.getElementById("matchesMessage");
let moveMessage = document.getElementById("moveMessage");
let highscoreKey = "memoryHighscore_" + difficulty;
let highscore = localStorage.getItem(highscoreKey) || 0;
let highscoreMessage = document.getElementById("highscoreMessage");
highscoreMessage.textContent = "Highscore: " + highscore;

let checkMatchProcess = 0;
let moveTracker = 0;
let matchCounter = 0;

//KARTE WIRD UMGEDREHT
function flipCard(event) {
    if(checkMatchProcess == 0) {
        const card = event.currentTarget;
        if(card.classList.contains('flipped') || card.classList.contains('matched')) return; //checken ob eh nicht 2 mal die gleiche karte

        //matchMessage.textContent = "";
        card.classList.add('flipped');
        card.innerHTML = `<i class="fa-brands ${card.dataset.symbol}"></i>`;
        flippedCards.push(card);

        if(flippedCards.length >= 2) {
                checkMatchProcess = 1;
                checkMatch();
            }
    }
}

//MATCH WIRD GECHWECKT
function checkMatch(){
    moveTracker++;
    moveMessage.textContent = moveTracker + " Moves";

    if(flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol){
        //matchMessage.textContent = "It's a Match!";
        flippedCards[0].classList.remove('flipped');
        flippedCards[0].classList.add('matched');
        flippedCards[1].classList.remove('flipped');
        flippedCards[1].classList.add('matched');

        undoCards();
        matchCounter++;
        matchesMessage.textContent = matchCounter + " Matches";

        //ALLE MATCHES
        if(matchCounter >= cards.length / 2) {
            winningMessage.style.display = "block";
            document.getElementById("moveMessageFinal").textContent = "You won in " + moveTracker + " moves!";
            
            let highscoreKey = "memoryHighscore_" + difficulty;

            if(highscore == 0 || moveTracker < highscore){
                highscore = moveTracker;
                localStorage.setItem(highscoreKey, highscore);
            }
            highscoreMessage.textContent = "Highscore: " + highscore;
        }
    } else {
        setTimeout(undoClicked, 800);
    }
}

//KARTEN WERDEN WIEDER UMGEDREHT
function undoClicked() {
    flippedCards[0].classList.remove('flipped');
    flippedCards[1].classList.remove('flipped');
    flippedCards[0].innerHTML = "";
    flippedCards[1].innerHTML = "";
    undoCards();
}

function undoCards() {
    flippedCards = [];
    checkMatchProcess = 0;
}

//BUTTON NEUES GAME
document.getElementById("newGame").addEventListener("click", resetGame);
document.getElementById("newGame2").addEventListener("click", resetGame);

function resetGame() {
    checkMatchProcess = 0;
    flippedCards = [];
    moveTracker = 0;
    matchCounter = 0;

    moveMessage.textContent = moveTracker + " Moves";
    matchesMessage.textContent = matchCounter + " Matches";
    //matchMessage.textContent = "";
    winningMessage.style.display = "none";

    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.remove('matched');
        card.textContent = "";
    });

    setupGame();
};

setupGame();
