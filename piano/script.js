const keys = [ //Noten-Objekte
    { note: "C4", key: "a", id: "keyC" },
    { note: "D4", key: "s", id: "keyD" },
    { note: "E4", key: "d", id: "keyE" },
    { note: "F4", key: "f", id: "keyF" },
    { note: "G4", key: "j", id: "keyG" },
    { note: "A4", key: "k", id: "keyA" },
    { note: "B4", key: "l", id: "keyB" },
    { note: "C#4", key: "w", id: "keyCis" },
    { note: "D#4", key: "e", id: "keyDis" },
    { note: "F#4", key: "u", id: "keyFis" },
    { note: "G#4", key: "i", id: "keyGis" },
    { note: "A#4", key: "o", id: "keyAis" }
];

let sounds = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C#4', 'D#4', 'F#4', 'G#4', 'A#4'];

let loadedNotes = [];

async function loadNotes(file = "song1.json") {
    try {
        const response = await fetch("songs/" + file);
        const data = await response.json();
        loadedNotes = data.notes;

        console.log("Loaded Song:", data.song);
        console.log("Notes:", loadedNotes);
    } catch (error) {
        console.error("Error loading notes:", error);
    }
}

loadNotes();

//Abspeielen durch Tastatur
document.addEventListener("keydown", function (event) {
    keys.forEach(k => {
        if (event.key.toLowerCase() === k.key) {
            playSound(sounds.indexOf(k.note));
            document.getElementById(k.id).style.backgroundColor =
                k.id.includes("is") ? "#4c4c4c" : "#d9d9d9";
        }
    });
});

document.addEventListener("keyup", function (event) {
    keys.forEach(k => {
        if (event.key.toLowerCase() === k.key) {
            document.getElementById(k.id).style.backgroundColor =
                k.id.includes("is") ? "#000000" : "#ffffff";
        }
    });
});

//ABspielen durch MAusklick:
document.addEventListener("mousedown", function (event) {
    keys.forEach(k => {
        if (event.target.id === k.id) {
            playSound(sounds.indexOf(k.note));
            document.getElementById(k.id).style.backgroundColor =
                k.id.includes("is") ? "#4c4c4c" : "#d9d9d9";
        }
    });
});

document.addEventListener("mouseup", function (event) {
    keys.forEach(k => {
        if (event.target.id === k.id) {
            document.getElementById(k.id).style.backgroundColor =
                k.id.includes("is") ? "#000000" : "#ffffff";
        }
    });
});


function playSound(note) {
    console.log("Playing", sounds[note]);
    let audio = new Audio(`sounds/${encodeURIComponent(sounds[note])}.mp3`);
    audio.play();
}


//Songs abspielen:

let isPlaying = false;
let currentIndex = 0;
let interval = null;

function playSong() {
    if (loadedNotes.length === 0) {
        console.log("keine Noten geladen, loadedNotes ist leer");
        return;
    }

    isPlaying = true;

    interval = setInterval(() => {
        if (currentIndex >= loadedNotes.length) { //song ist zu Ende
            clearInterval(interval);
            isPlaying = false;
            currentIndex = 0;
            return;
        }

        let note = loadedNotes[currentIndex]; //aktuelle Note aus Array

        let keyPlay = keys.find(k => k.note === note); //richtige Taste finden

        if (keyPlay) {
            playSound(sounds.indexOf(note));

            let taste = document.getElementById(keyPlay.id);
            taste.style.backgroundColor =
                keyPlay.id.includes("is") ? "#4c4c4c" : "#d9d9d9";

            // nach kurzer Zeit zurücksetzen
            setTimeout(() => {
                taste.style.backgroundColor = keyPlay.id.includes("is") ? "#000000" : "#ffffff"; //back zu schwarz bei -is
            }, 300);
        }

        currentIndex++;
    }, 600);
}

// funktion Puasieren
function pauseSong() {
    clearInterval(interval);
    isPlaying = false;
}

//Song spielen mit Tastatur, p spielen, Leertaste pausieren
document.addEventListener("keydown", function (event) {

    if (event.key.toLowerCase() === "p") {
        if (!isPlaying) {
            playSong();
        }
    }

    if (event.key === " ") {
        pauseSong();
    }
});

//abspielen mit Button
document.getElementById("playButton").addEventListener("click", () => {
    if (!isPlaying) playSong();
});

//pausieren mit Button 
document.getElementById("pauseButton").addEventListener("click", pauseSong);

//zurücksetzen
function resetApp() {
    clearInterval(interval);
    isPlaying = false;
    currentIndex = 0;

    keys.forEach(k => {
        let taste = document.getElementById(k.id);
        taste.style.backgroundColor =
            k.id.includes("is") ? "#000000" : "#ffffff";
    });

    console.log("zurückgesetzt");
}

document.getElementById("resetButton").addEventListener("click", resetApp);

//songs wechseln:
document.getElementById("songAuswahl").addEventListener("change", function () {
    let selectedFile = this.value;
    loadNotes(selectedFile);
    resetApp();
});