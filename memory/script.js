
let cards = ['apple', 'apple', 'banana', 'banana', 'grape', 'grape', 'orange', 'orange'];

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}
shuffle(cards);
console.log(cards); 

document.getElementById("winningMessage").style.display = "none";
let checkMatchProcess = 0;
let moveTracker = 0;
let matchCounter = 0;
let cardOne = null;
let cardTwo = null;

function clicked(cardNumb) { 
    if(checkMatchProcess == 0) {
        document.getElementById("matchMessage").textContent = "";

        let cardText = document.getElementById("cardText" + cardNumb);
        console.log("Clicked card" + cardText);

        if (cardText.textContent === "?") {
            //console.log("Im if-statement");
            cardText.textContent = cards[cardNumb];
            document.getElementById("card" + cardNumb).style.backgroundColor = "#ff9500";
            console.log(cards[cardNumb]);
        
            if(!cardOne) {
                cardOne = cardText;
            } else {
                cardTwo = cardText;
                checkMatchProcess = 1;
                checkMatch();
            }
        }
    }
}


function checkMatch(){
    moveTracker++;
    document.getElementById("moveMessage").textContent = moveTracker + " Moves";

    if(cardOne.textContent === cardTwo.textContent){
        console.log("Match");

        document.getElementById("matchMessage").textContent = "It's a Match!";
        cardOne.parentElement.style.backgroundColor = "#489c56";
        cardTwo.parentElement.style.backgroundColor = "#489c56";
        
        undoCards();
        matchCounter++;

        //ALLE MATCHES
        if(matchCounter >= 4) {
            document.getElementById("winningMessage").style.display = "block";
        }
    } else {
        setTimeout(undoClicked, 1000);
    }
}

function undoClicked() {
    cardOne.textContent = "?";
    cardTwo.textContent = "?";
    cardOne.parentElement.style.backgroundColor = "#007bff";
    cardTwo.parentElement.style.backgroundColor = "#007bff";
    undoCards();
}

function undoCards() {
    cardOne = null;
    cardTwo = null;
    checkMatchProcess = 0;
}