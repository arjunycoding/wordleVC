let validKeys = [] //backspace & enter
for (let i = 65; i <= 90; i++) { //all alphabets
    validKeys.push(i)
}
$('#modal').hide()
$(".headerIcon").hide()
$("#showAllClues").hide()
let instuctions = new Audio("./instuctions.m4a")
$(document).ready(function () {
    if (localStorage.getItem("instuction") == null) {
        instuctions.play()
        localStorage.setItem("instuction", 1)
    }
});
$(document).keydown(function (event) {
    if (event.keyCode == 32 && event.target.nodeName !== "INPUT") {
        instuctions.pause()
        return false;
    }
});
let pointCout = 100
let totalPoints = pointCout
let randomIndex = Math.floor(Math.random() * words.length)
let text = ""
let displayText = ""
let names = ["math", "science", "random", "computers"]
let id = ["easy", "medium", "hard"]
let audioFiles = []
$(".message").hide()
$("#currentTile").val("1")
let url = new URL(window.location.href)
let search_params = url.searchParams
if (search_params.has('id') && words.length > search_params.get('id')) {
    randomIndex = search_params.get('id')
    $("#game").show()
    $("#form").hide()
    $("#tile1").focus()
}
$("#tile1").focus()
let word = words[randomIndex]
console.log(word)
let inputId = $(this).attr("")
function everything(keyPressed, keyCode, event = null) {
    let currentTile = parseInt($("#currentTile").val())
    let inputId = currentTile < 1 ? "hiddenTile" : "tile" + currentTile
    let nextTileNumber = parseInt($("#nextTile").val())
    if (validKeys.includes(keyCode) && inputId != "hiddenTile") {
        $(`#${inputId}`).val(keyPressed)
        if (shouldMoveTile(inputId)) {
            let nextTile = getNextTile(inputId)
            $(`#${nextTile}`).focus()
            currentTile += 1
        } else {
            $("#nextTile").val(extractTileNumber(inputId) + 1)
            $("#hiddenTile").focus()
            currentTile = 0
        }
        $("#currentTile").val(currentTile)
    } else if (keyCode == 13 && inputId == "hiddenTile") { // ENTER Key pressed
        let number = parseInt($("#nextTile").val()) - 1
        let enteredWord = extractWord(number)
        let result = checkWord(enteredWord, word)
        if (result.result) { // when the guess is right
            let i = $("#nextTile").val() - 1
            let stopat = i - 5
            audioFiles = []
            for (; i >= stopat; i--) {
                $(`#tile${i}`).addClass("right")
                $(`#tile${i}`).addClass("speacialFlip")
                console.log($(`#tile${i}`).val())
                $(`.letter:contains(${($(`#tile${i}`).val()).toUpperCase()})`).addClass("right")
                audioFiles.push(`letters/${($(`#tile${i}`).val()).toUpperCase()}`)
            }
            audioFiles.reverse()
            audioFiles.push("messages/won")
            audioFiles.shift()
            console.log(audioFiles)
            play(0, audioFiles, true)
            $("#showClue1").hide()
            $("#showClue2").hide()
            $("#showClue3").hide()
            pop()
            text += "🟩🟩🟩🟩🟩"
            displayText += "🟩🟩🟩🟩🟩"
            let lines = ((displayText.split("<br>")).length)
            text = `${lines} Tries \n ${pointCout} Points\n` + text + `\nWant To Play The Same Wordle? Go To: https://arjunycoding.github.io/wordle/?id=${randomIndex}`
            console.log(`${lines} Tires \nBefore \n${pointCout} Points\n More`)
            $("#textMessage").val(text)
            setTimeout(() => {
                $("input").attr("disabled", "disabled")
                $('#modal').click()
                $(".modal-body").html(
                    `You Got It!<br> The word was ${word}<br> You earned ${pointCout}/${totalPoints} Points <br>Here is your attempt: <br> ${displayText}`
                )
            }, 3000)
        } else { // when the guess is wrong
            isRealWord(enteredWord)
                .then((isReal) => {
                    audioFiles = []
                    if (isReal) {

                        let i = nextTileNumber - 5
                        result.positions.forEach((value) => {
                            $(`#tile${i}`).addClass(value)
                            $(`#tile${i}`).addClass("flip")
                            $(`#tile${i}`).prop('disabled', true)
                            document.getElementById(`tile${i}`).readOnly = true
                            audioFiles.push(`letters/${($(`#tile${i}`).val()).toUpperCase()}`)
                            // Add Keyboard Colors
                            if (value == "right") {
                                audioFiles.push("messages/right")
                                text += "🟩"
                                displayText += "🟩"
                                $(`.letter:contains(${($(`#tile${i}`).val()).toUpperCase()})`).addClass("right")
                                if ($(`.letter:contains(${($(`#tile${i}`).val()).toUpperCase()})`).hasClass("exists")) {
                                    $(`.letter:contains(${($(`#tile${i}`).val()).toUpperCase()})`).removeClass("exists")
                                }
                            } else if (value == "exists") {
                                audioFiles.push("messages/present")
                                text += "🟨"
                                displayText += "🟨"
                                if ($(`.letter:contains(${($(`#tile${i}`).val()).toUpperCase()})`).hasClass("right")) {

                                } else {
                                    $(`.letter:contains(${($(`#tile${i}`).val()).toUpperCase()})`).addClass("exists")
                                }
                            } else if (value == "wrong") {
                                audioFiles.push("messages/absent")
                                text += "⬛"
                                displayText += "⬛"
                                if (!$(`.letter:contains(${($(`#tile${i}`).val()).toUpperCase()})`).hasClass("right")) {
                                    $(`.letter:contains(${($(`#tile${i}`).val()).toUpperCase()})`).addClass("wrong")
                                }
                            }
                            console.log(audioFiles)
                            audioFiles.forEach((value) => {
                                console.log(value)
                            })
                            i++
                        })
                        play(0, audioFile)
                        text += "\n"
                        displayText += "<br>"
                        $("#textMessage").val(text)

                        //proceed to the next row: 
                        let nextTile = "#tile" + nextTileNumber

                        $("#currentTile").val(nextTileNumber)
                        $(nextTile).focus()


                        if (nextTile == "#tile31") {
                            setTimeout(() => {
                                $(".alert-primary").fadeIn(1500).text("You did not get the word 😟. The word was " + word)
                                audioFiles = []
                                let i = $("#nextTile").val() - 1
                                let stopat = i - 4
                                audioFiles = []
                                for (; i >= stopat; i--) {
                                    console.log($(`#tile${i}`).val())
                                    audioFiles.push(`letters/${($(`#tile${i}`).val()).toUpperCase()}`)
                                }
                                audioFiles.push("messages/sorry")
                                audioFiles.reverse()
                                play(0, audioFiles)
                            }, 18000)
                        }
                        pointCout -= 10

                        $("#ponitCount").html(pointCout)
                    } else {
                        let i = $("#nextTile").val() - 1
                        let stopat = i - 4
                        audioFiles = []
                        audioFiles.push("messages/invalid")
                        for (; i >= stopat; i--) {
                            audioFiles.push(`letters/${($(`#tile${i}`).val()).toUpperCase()}`)
                        }
                        audioFiles.reverse()
                        play(0, audioFiles)
                        $(`#tile${nextTileNumber}`).focus()
                        $(".alert-danger").fadeIn(1000).text("Not a word")
                        setTimeout(() => {
                            $(".alert-danger").fadeOut(1000)
                        }, 3000)
                    }
                })
        }
    } else if (keyCode == 8) { // DELETE key pressed
        //     then we have to use nextTile to find while tiles to delete the values from
        if (inputId == "tile6" || inputId == "tile11" || inputId == "tile16" || inputId == "tile21" || inputId == "tile26") {

        } else if (inputId == "hiddenTile") {
            $(`#tile${nextTileNumber - 1}`).val("")
            $(`#tile${nextTileNumber - 1}`).focus()
            $("#currentTile").val((nextTileNumber - 1))
        } else {
            $(`#tile${currentTile}`).val("")
            $(`#tile${currentTile - 1}`).val("")
            $(`#tile${currentTile - 1}`).focus()
            $("#currentTile").val((currentTile - 1))

        }
    } else {
        if (event) {
            event.preventDefault()
        }
    }
}
$(".guess").keydown(function (event) {
    everything(event.key, event.keyCode, event)
})

$(".letter").on("click", function (event) {
    let letter = $(this).val()
    everything(letter, getKeyCode(letter))
})

