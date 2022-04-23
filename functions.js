/**
 * this function returns a json object with two keys: 
 *      - key1 contains the end result (true / false)
 *      - key2 contains an array of char positions and values indicate one of the following: 
 *          - right: if the char exists and is in the right place 
 *          - exists: if the char exists but is in the wrong place 
 *          - wrong: if the char does not exist in the actualWord 
 **/
function checkWord(enteredWord, actualWord) {
    enteredWord = enteredWord.toLowerCase()
    actualWord = actualWord.toLowerCase()
    if (enteredWord == actualWord) {
        return {
            "result": true,
            "positions": ["right", "right", "right", "right", "right"]
        }
    } else {
        let positions = []
        let checkedLetters = []
        for (let i = 0; i < enteredWord.length; i++) {
            if (!checkedLetters.includes(enteredWord[i])) {
                if (enteredWord[i] == actualWord[i]) {
                    positions.push("right")
                } else if (actualWord.includes(enteredWord[i])) {
                    positions.push("exists")
                } else {
                    positions.push("wrong")
                }
            } else {
                positions.push("wrong")
            }
            checkedLetters.push(enteredWord[i])
        }
        return {
            "result": false,
            "positions": positions
        }
    }
}
// This function checks the word inputed and returns if the word is true
async function isRealWord(wordToCheck) {
    let link = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordToCheck}`
    let response = await fetch(link)
    let result = await response.json()
    return await result.title != "No Definitions Found"
}
// this fucntions gets the word inputed based on what input you are on
function extractWord(tileNumber) {
    if (tileNumber % 5 == 0) { //extract only when at the end tile for the word
        let enteredWord = ""
        let startPosition = tileNumber - 4
        for (; startPosition <= tileNumber; startPosition++) {
            enteredWord += $(`#tile${startPosition}`).val()
        }
        return enteredWord
    }
    return ""
}

// This function checks if you should move tiles
function shouldMoveTile(inputId) {
    if (extractTileNumber(inputId) % 5 == 0) {
        return false
    }
    return true
}

// this function returns the next input box
function getNextTile(inputId) {
    let number = extractTileNumber(inputId)
    return inputId.slice(0, 4) + (number + 1)
}

// this function returns the prevoius input box
function getPreviousTile(inputId) {
    let number = extractTileNumber(inputId)
    return inputId.slice(0, 4) + (number - 1)
}

// this function gets which the tile number you are on(Ex: "tile2" --> "2")
function extractTileNumber(inputId) {
    let numberString = inputId.length > 4 ? inputId.slice(4, 6) : inputId[4]
    return parseInt(numberString)
}

// this function gets the keycode of the key you passed
function getKeyCode(letter) {
    let letters = {
        "a": 65,
        "b": 66,
        "c": 67,
        "d": 68,
        "e": 69,
        "f": 70,
        "g": 71,
        "h": 72,
        "i": 73,
        "j": 74,
        "k": 75,
        "l": 76,
        "m": 77,
        "n": 78,
        "o": 79,
        "p": 80,
        "q": 81,
        "r": 82,
        "s": 83,
        "t": 84,
        "u": 85,
        "v": 86,
        "w": 87,
        "x": 88,
        "y": 89,
        "z": 90,
        "enter": 13,
        "delete": 8
    }
    return letters[letter.toLowerCase()]
}

function play(index, wordArray, muteAfter = false) {
    audio = new Audio(`${wordArray[index]}.m4a`)
    audio.play()
    audio.onended = function () {
        if (index < (wordArray.length - 1)) {
            index += 1
            play(index, wordArray)
        } else {
            if (muteAfter) {
                audio.volume = 0
            }
            return
        }
    }
}

function sleep(seconds) {
    var currentTime = new Date().getTime();
    while (currentTime + seconds >= new Date().getTime()) {
    }
}



function copyText(inputId, btn) {
    var copyText = document.getElementById(inputId)
    copyText.select()
    copyText.setSelectionRange(0, 99999)
    navigator.clipboard.writeText(copyText.value)
    $(btn).text("Copied To Clipboard!")
    setTimeout(() => { $(btn).text("Share") }, 2000)
}
