let sounds = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C#4', 'D#4', 'F#4', 'G#4', 'A#4'];

document.addEventListener("keydown", function (event) {

    if(event.key.toLowerCase() === "a") {
        playSound(0);
        document.getElementById("keyC").style.backgroundColor = "#d9d9d9";
    } else if(event.key.toLowerCase() === "s") {
        playSound(1);
        document.getElementById("keyD").style.backgroundColor = "#d9d9d9";
    } else if(event.key.toLowerCase() === "d") {
        playSound(2);
        document.getElementById("keyE").style.backgroundColor = "#d9d9d9";
    } else if(event.key.toLowerCase() === "f") {
        playSound(3);
        document.getElementById("keyF").style.backgroundColor = "#d9d9d9";
    } else if(event.key.toLowerCase() === "j") {
        playSound(4);
        document.getElementById("keyG").style.backgroundColor = "#d9d9d9";
    } else if(event.key.toLowerCase() === "k") {
        playSound(5);
        document.getElementById("keyA").style.backgroundColor = "#d9d9d9";
    } else if(event.key.toLowerCase() === "l") {
        playSound(6);
        document.getElementById("keyB").style.backgroundColor = "#d9d9d9";
    } else if(event.key.toLowerCase() === "w") {
        playSound(7);
        document.getElementById("keyCis").style.backgroundColor = "#4c4c4c";
    } else if(event.key.toLowerCase() === "e") {
        playSound(8);
        document.getElementById("keyDis").style.backgroundColor = "#4c4c4c";
    } else if(event.key.toLowerCase() === "u") {
        playSound(9);
        document.getElementById("keyFis").style.backgroundColor = "#4c4c4c";
    } else if(event.key.toLowerCase() === "i") {
        playSound(10);
        document.getElementById("keyGis").style.backgroundColor = "#4c4c4c";
    } else if(event.key.toLowerCase() === "o") {
        playSound(11);
        document.getElementById("keyAis").style.backgroundColor = "#4c4c4c";
    }
});

document.addEventListener("keyup", function (event) {
    switch (event.key.toLowerCase()) {
        case "a": document.getElementById("keyC").style.backgroundColor = "#ffffff"; break;
        case "s": document.getElementById("keyD").style.backgroundColor = "#ffffff"; break;
        case "d": document.getElementById("keyE").style.backgroundColor = "#ffffff"; break;
        case "f": document.getElementById("keyF").style.backgroundColor = "#ffffff"; break;
        case "j": document.getElementById("keyG").style.backgroundColor = "#ffffff"; break;
        case "k": document.getElementById("keyA").style.backgroundColor = "#ffffff"; break;
        case "l": document.getElementById("keyB").style.backgroundColor = "#ffffff"; break;
        case "w": document.getElementById("keyCis").style.backgroundColor = "#000000"; break;
        case "e": document.getElementById("keyDis").style.backgroundColor = "#000000"; break;
        case "u": document.getElementById("keyFis").style.backgroundColor = "#000000"; break;
        case "i": document.getElementById("keyGis").style.backgroundColor = "#000000"; break;
        case "o": document.getElementById("keyAis").style.backgroundColor = "#000000"; break;
    }
});

document.addEventListener("mousedown", function (event) {

    if(event.target.id === "keyC") {
        playSound(0);
        document.getElementById("keyC").style.backgroundColor = "#d9d9d9";
    } else if(event.target.id === "keyD") {
        playSound(1);
        document.getElementById("keyD").style.backgroundColor = "#d9d9d9";
    } else if(event.target.id === "keyE") {
        playSound(2);
        document.getElementById("keyE").style.backgroundColor = "#d9d9d9";
    } else if(event.target.id === "keyF") {
        playSound(3);
        document.getElementById("keyF").style.backgroundColor = "#d9d9d9";
    } else if(event.target.id === "keyG") {
        playSound(4);
        document.getElementById("keyG").style.backgroundColor = "#d9d9d9";
    } else if(event.target.id === "keyA") {
        playSound(5);
        document.getElementById("keyA").style.backgroundColor = "#d9d9d9";
    } else if(event.target.id === "keyB") {
        playSound(6);
        document.getElementById("keyB").style.backgroundColor = "#d9d9d9";
    } else if(event.target.id === "keyCis") {
        playSound(7);
        document.getElementById("keyCis").style.backgroundColor = "#4c4c4c";
    } else if(event.target.id === "keyDis") {
        playSound(8);
        document.getElementById("keyDis").style.backgroundColor = "#4c4c4c";
    } else if(event.target.id === "keyFis") {
        playSound(9);
        document.getElementById("keyFis").style.backgroundColor = "#4c4c4c";
    } else if(event.target.id === "keyGis") {
        playSound(10);
        document.getElementById("keyGis").style.backgroundColor = "#4c4c4c";
    } else if(event.target.id === "keyAis") {
        playSound(11);
        document.getElementById("keyAis").style.backgroundColor = "#4c4c4c";
    }
});

document.addEventListener("mouseup", function (event) {
    switch (event.target.id) {
        case "keyC": document.getElementById("keyC").style.backgroundColor = "#ffffff"; break;
        case "keyD": document.getElementById("keyD").style.backgroundColor = "#ffffff"; break;
        case "keyE": document.getElementById("keyE").style.backgroundColor = "#ffffff"; break;
        case "keyF": document.getElementById("keyF").style.backgroundColor = "#ffffff"; break;
        case "keyG": document.getElementById("keyG").style.backgroundColor = "#ffffff"; break;
        case "keyA": document.getElementById("keyA").style.backgroundColor = "#ffffff"; break;
        case "keyB": document.getElementById("keyB").style.backgroundColor = "#ffffff"; break;
        case "keyCis": document.getElementById("keyCis").style.backgroundColor = "#000000"; break;
        case "keyDis": document.getElementById("keyDis").style.backgroundColor = "#000000"; break;
        case "keyFis": document.getElementById("keyFis").style.backgroundColor = "#000000"; break;
        case "keyGis": document.getElementById("keyGis").style.backgroundColor = "#000000"; break;
        case "keyAis": document.getElementById("keyAis").style.backgroundColor = "#000000"; break;
    }
});



function playSound(note) {
    console.log("Playing", sounds[note]);
    let audio = new Audio(`sounds/${encodeURIComponent(sounds[note])}.mp3`);
    audio.play();
}