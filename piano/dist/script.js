var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class PianoKey {
    constructor({ note, color, key, id }) {
        this.note = note;
        this.color = color;
        this.key = key;
        this.id = id;
    }
    playSound() {
        const audio = new Audio(`sounds/${encodeURIComponent(this.note)}.mp3`);
        audio.play();
    }
    highlight() {
        const el = document.getElementById(this.id);
        if (el)
            el.style.backgroundColor = this.color === "black" ? "#4c4c4c" : "#d9d9d9";
    }
    unhighlight() {
        const el = document.getElementById(this.id);
        if (el)
            el.style.backgroundColor = this.color === "black" ? "#000000" : "#ffffff";
    }
}
let isPlaying = false;
let currentIndex = 0;
let loadedNotes = [];
const keys = [
    new PianoKey({ note: "C4", key: "a", color: "white", id: "keyC" }),
    new PianoKey({ note: "D4", key: "s", color: "white", id: "keyD" }),
    new PianoKey({ note: "E4", key: "d", color: "white", id: "keyE" }),
    new PianoKey({ note: "F4", key: "f", color: "white", id: "keyF" }),
    new PianoKey({ note: "G4", key: "j", color: "white", id: "keyG" }),
    new PianoKey({ note: "A4", key: "k", color: "white", id: "keyA" }),
    new PianoKey({ note: "B4", key: "l", color: "white", id: "keyB" }),
    new PianoKey({ note: "C#4", key: "w", color: "black", id: "keyCis" }),
    new PianoKey({ note: "D#4", key: "e", color: "black", id: "keyDis" }),
    new PianoKey({ note: "F#4", key: "u", color: "black", id: "keyFis" }),
    new PianoKey({ note: "G#4", key: "i", color: "black", id: "keyGis" }),
    new PianoKey({ note: "A#4", key: "o", color: "black", id: "keyAis" }),
];
function loadNotes() {
    return __awaiter(this, arguments, void 0, function* (file = "song1.json") {
        try {
            const response = yield fetch(`songs/${file}`);
            const data = yield response.json();
            loadedNotes = data.notes;
            console.log("Loaded Song:", data.song);
            console.log("Notes:", loadedNotes);
        }
        catch (err) {
            console.error("Error loading notes:", err);
        }
    });
}
loadNotes();
let interval = null;
function playSong() {
    if (loadedNotes.length === 0)
        return;
    isPlaying = true;
    interval = window.setInterval(() => {
        if (currentIndex >= loadedNotes.length) {
            if (interval)
                clearInterval(interval);
            isPlaying = false;
            currentIndex = 0;
            return;
        }
        const note = loadedNotes[currentIndex];
        if (!note)
            return;
        const keyPlay = keys.find(k => k.note === note);
        if (keyPlay) {
            keyPlay.playSound();
            keyPlay.highlight();
            setTimeout(() => keyPlay.unhighlight(), 300);
        }
        currentIndex++;
    }, 600);
}
function pauseSong() {
    if (interval)
        clearInterval(interval);
    isPlaying = false;
}
function resetApp() {
    if (interval)
        clearInterval(interval);
    isPlaying = false;
    currentIndex = 0;
    keys.forEach(k => k.unhighlight());
}
document.addEventListener("keydown", (event) => {
    keys.forEach(k => {
        if (event.key.toLowerCase() === k.key) {
            k.playSound();
            k.highlight();
        }
    });
    if (event.key.toLowerCase() === "p" && !isPlaying)
        playSong();
    if (event.key === " ")
        pauseSong();
});
document.addEventListener("keyup", (event) => {
    keys.forEach(k => {
        if (event.key.toLowerCase() === k.key)
            k.unhighlight();
    });
});
keys.forEach(k => {
    const el = document.getElementById(k.id);
    if (!el)
        return;
    el.addEventListener("mousedown", () => {
        k.playSound();
        k.highlight();
    });
    el.addEventListener("mouseup", () => k.unhighlight());
    el.addEventListener("mouseleave", () => k.unhighlight());
});
const playBtn = document.getElementById("playButton");
playBtn === null || playBtn === void 0 ? void 0 : playBtn.addEventListener("click", () => { if (!isPlaying)
    playSong(); });
const pauseBtn = document.getElementById("pauseButton");
pauseBtn === null || pauseBtn === void 0 ? void 0 : pauseBtn.addEventListener("click", pauseSong);
const resetBtn = document.getElementById("resetButton");
resetBtn === null || resetBtn === void 0 ? void 0 : resetBtn.addEventListener("click", resetApp);
const songSelect = document.getElementById("songAuswahl");
songSelect === null || songSelect === void 0 ? void 0 : songSelect.addEventListener("change", function () {
    loadNotes(this.value);
    resetApp();
});
export {};
//# sourceMappingURL=script.js.map