interface PianoKeyProps {
    note: string;
    color: string; 
    key: string;
}

class PianoKey {
    note: string;
    color: string;
    key: string;
    id: string;

    constructor({ note, color, key, id }: PianoKeyProps & { id: string }) {
        this.note = note;
        this.color = color;
        this.key = key;
        this.id = id;
    }

    playSound(): void {
        const audio = new Audio(`sounds/${encodeURIComponent(this.note)}.mp3`);
        audio.play();
    }

    highlight(): void {
        const el = document.getElementById(this.id);
        if (el) el.style.backgroundColor = this.color === "black" ? "#004D80" : "#a0d8e7";
    }

    unhighlight(): void {
        const el = document.getElementById(this.id);
        if (el) el.style.backgroundColor = this.color === "black" ? "#000000" : "#ffffff";
    }
}

let isPlaying: boolean = false;
let currentIndex: number = 0;
let loadedNotes: string[] = [];
const keys: PianoKey[] = [
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

async function loadNotes(file: string = "song1.json"): Promise<void> {
    try {
        const response = await fetch(`songs/${file}`);
        const data = await response.json();
        loadedNotes = data.notes as string[];
        console.log("Loaded Song:", data.song);
        console.log("Notes:", loadedNotes);
    } catch (err) {
        console.error("Error loading notes:", err);
    }
}

loadNotes();

let interval: number | null = null;

function playSong(): void {
    if (loadedNotes.length === 0) return;
    isPlaying = true;

    interval = window.setInterval(() => {
        if (currentIndex >= loadedNotes.length) {
            if (interval) clearInterval(interval);
            isPlaying = false;
            currentIndex = 0;
            return;
        }

        const note: string | undefined = loadedNotes[currentIndex];
        if (!note) return;

        const keyPlay = keys.find(k => k.note === note);
        if (keyPlay) {
            keyPlay.playSound();
            keyPlay.highlight();
            setTimeout(() => keyPlay.unhighlight(), 300);
        }

        currentIndex++;
    }, 600);
}

function pauseSong(): void {
    if (interval) clearInterval(interval);
    isPlaying = false;
}

function resetApp(): void {
    if (interval) clearInterval(interval);
    isPlaying = false;
    currentIndex = 0;

    keys.forEach(k => k.unhighlight());
}

document.addEventListener("keydown", (event: KeyboardEvent) => {
    keys.forEach(k => {
        if (event.key.toLowerCase() === k.key) {
            k.playSound();
            k.highlight();
        }
    });

    if (event.key.toLowerCase() === "p" && !isPlaying) playSong();
    if (event.key === " ") pauseSong();
});

document.addEventListener("keyup", (event: KeyboardEvent) => {
    keys.forEach(k => {
        if (event.key.toLowerCase() === k.key) k.unhighlight();
    });
});

keys.forEach(k => {
    const el = document.getElementById(k.id);
    if (!el) return;

    el.addEventListener("mousedown", () => {
        k.playSound();
        k.highlight();
    });

    el.addEventListener("mouseup", () => k.unhighlight());
    el.addEventListener("mouseleave", () => k.unhighlight());
});

const playBtn = document.getElementById("playButton") as HTMLButtonElement | null;
playBtn?.addEventListener("click", () => { if (!isPlaying) playSong(); });

const pauseBtn = document.getElementById("pauseButton") as HTMLButtonElement | null;
pauseBtn?.addEventListener("click", pauseSong);

const resetBtn = document.getElementById("resetButton") as HTMLButtonElement | null;
resetBtn?.addEventListener("click", resetApp);

const songSelect = document.getElementById("songAuswahl") as HTMLSelectElement | null;
songSelect?.addEventListener("change", function(this: HTMLSelectElement) {
    loadNotes(this.value);
    resetApp();
});