// game.js Created by Jake D'Esposito in 2022
// This isn't lisensed but if you use code from here it would be nice if you credit me or like to my Github or website.

/**
 * @param {0x001 | 0x010 | 0x100} player is a hex numbers that can be 0x001, 0x010, or 0x100
 * @param {0x001 | 0x010 | 0x100} opponent is a hex numbers that can be 0x001, 0x010, or 0x100
 * 
 * 0x001 : rock
 * 0x010 : paper
 * 0x100 : scissors
 *
 * @returns {-1} -1 if the opponent won
 * @returns {1} 1 if the player won
 * @returns {0} 0 if there is a tie
 */
function determineGame (player, opponent) {
    // If the player and opponent pick the same option, the there is a tie
    if (player === opponent)
        return 0
    else {
        // A combination of player & opponent
        const combinedHex = player | opponent
        
        // Checks which of the possible 3 combinations have been inputed
        // When a case that matches is found, it if the player picked the winning option and returns a winner appropriatly
        switch (combinedHex) {
            case 0x110:
                if (player === 0x100)
                    return 1
                return -1
            case 0x101:
                if (player === 0x001)
                    return 1
                return -1
            case 0x011:
                if (player === 0x010)
                    return 1
                return -1
        }
    }
}

// Initializes sound effect to be used later on
const winSound = new Audio("res/win.wav")
const tieSound = new Audio("res/tie.wav")
const lossSound = new Audio("res/loss.wav")
const rewindSound = new Audio("res/rewind.wav")

/**
 * This function is called when clicking on the rock, paper, or scissors
 * @param {0x001 | 0x010 | 0x100} playerChoice the hex value that represents the choice. See determineGame.
 */
function playGame (playerChoice) {

    // Make opponent choice
    let shift = Math.floor(Math.random() * 3)
    // It is possible that shift is 3 but there isn't 4 options to map 3 to 2.
    if (shift === 3)
        shift = 2

    // A representation of the computers choice in hex.
    const opponentChoice = 0x1 << (shift * 4)

    const gameResult = determineGame(playerChoice, opponentChoice)

    // Removes the icon from Opponents Choice section
    $("#opponent-choice-icon").text("")

    $("#player-choice-text").removeClass("pulse")
    $("#opponent-choice-text").addClass("pulse")

    // Plays animation for spinner then does something else
    animateOpponentSpinner().then(() => {

        // Analyzes game result and takes approprate action
        switch (gameResult) {
            case 1:
                winSound.play()
                incrementScore("wins")
                break
            case 0:
                tieSound.play()
                incrementScore("ties")
                break
            case -1:
                lossSound.play()
                incrementScore("losses")
                break
        }

        update(playerChoice, opponentChoice, gameResult)

        $("#opponent-choice-text").removeClass("pulse")
        $("#player-choice-text").addClass("pulse")
    })
}

/**
 * Safely gets the score for wins, ties, or losses as a number.
 * @param {"wins" | "ties" | "losses"} type 
 * 
 * If it exists, it will return its value.
 * If it doesn't exist, it will set its value to 0 and return 0.
 * 
 * @returns {Number} The score.
 */
function getScore (type) {
    const storageScore = localStorage.getItem(type)
    if (storageScore)
        return new Number(storageScore)
    else {
        localStorage.setItem(type, 0)
        return 0
    }
}

/**
 * Increments the score for wins, ties, or losses.
 * @param {"wins" | "ties" | "losses"} type 
 * 
 * @returns {Number} The incremented score.
 */
function incrementScore (type) {
    const score = getScore(type)
    localStorage.setItem(type, score + 1)
}

/**
 * Clears storage of any scores.
 */
function clearScores () {
    rewindSound.play()

    localStorage.setItem("wins", 0)
    localStorage.setItem("ties", 0)
    localStorage.setItem("losses", 0)

    update()
}

/**
 * Converts the hex choice to a usable string.
 * @param {0x001 | 0x010 | 0x100} choice 
 * @returns {"Rock" | "Paper" | "Scissors"}
 */
function choiceToString (choice) {
    switch (choice) {
        case 0x001:
            return "Rock"
        case 0x010:
            return "Paper"
        case 0x100:
            return "Scissors"
    }
}

/**
 * Coverts the hex choice to its appropriate icon.
 * @param {0x001 | 0x010 | 0x100} choice 
 * @returns {"diamond" | "note" | "cut"}
 */
function choiceToIcon (choice) {
    switch (choice) {
        case 0x001:
            return "diamond"
        case 0x010:
            return "note"
        case 0x100:
            return "cut"
    }
}

/**
 * Returns a string of the player vs opponent outcome.
 * @param {1 | 0 | -1} gameResult 
 * @returns {"beats" | "ties" | "does not beat"}
 */
function gameResultVsText (gameResult) {
    switch (gameResult) {
        case 1:
            return "beats"
        case 0:
            return "ties"
        case -1:
            return "does not beat"
    }
}

/**
 * Returns result of the game for the player.
 * @param {1 | 0 | -1} gameResult 
 * @returns {"win" | "tie" | "loose"}
 */
function gameResultText (gameResult) {
    switch (gameResult) {
        case 1:
            return "win"
        case 0:
            return "tie"
        case -1:
            return "loose"
    }
}

/**
 * Updates the wins, ties, and looses on the webpage
 * @param {Number} playerChoice is a hex numbers that can be 0x001, 0x010, or 0x100. See determineGame.
 * @param {Number} opponentChoice is a hex numbers that can be 0x001, 0x010, or 0x100. See determineGame.
 * @param {Number} gameResult is a hex numbers that can be 0x001, 0x010, or 0x100. See determineGame.
 */
function update (playerChoice, opponentChoice, gameResult) {
    // Updates the wins, ties, and looses text
    $("#wins").text(getScore("wins"))
    $("#ties").text(getScore("ties"))
    $("#losses").text(getScore("losses"))

    $("#wins").removeClass("pulse-once")
    $("#ties").removeClass("pulse-once")
    $("#losses").removeClass("pulse-once")

    // On the initial page load, gameResult will be undefined so we can skip all of this. Otherwise run it.
    if (gameResult !== undefined) {

        // Sets icon of then opponents choice
        $("#opponent-choice-icon").text(choiceToIcon(opponentChoice))

        $("#gameResult").css("visibility", "visible")

        // Updates the game result text
        $("#gameResult").text(`${choiceToString(playerChoice)} ${gameResultVsText(gameResult)} ${choiceToString(opponentChoice).toLowerCase()}. You ${gameResultText(gameResult)}!`)

        // Pulses the score that gets changed based on gameResult
        switch (gameResult) {
            case 1:
                $("#wins").addClass("pulse-once")
                break
            case 0:
                $("#ties").addClass("pulse-once")
                break
            case -1:
                $("#losses").addClass("pulse-once")
                break
        }
    }
}

// Calls update on file load
// TODO: All this is doing is updating the text. The code that updates the text can be moved outside of update.
update()

// Fun promise based delay that I found on stack overflow lol. Thanks mystery internet person.
const delay = async (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Animates the opponent choice spinner
 */
async function animateOpponentSpinner () {

    // Makes spinner render
    $("#opponent-spinner").css("display", "revert")

    await delay(2000)

    // Slows spinning speed
    $("#opponent-spinner").attr("scrollamount", 25)

    await delay(2000)

    // Slows spinning speed again
    $("#opponent-spinner").attr("scrollamount", 10)

    await delay(2000)

    // Makes spinner not render
    $("#opponent-spinner").css("display", "none")

    // Resets spinning speed for the next time that it has to get rendered
    $("#opponent-spinner").attr("scrollamount", 50)

}

/**
 * Event for muting and unmuting audio
 */
function e_MuteAudio () {
    const checked = new Boolean(document.getElementById("muteAudio").checked)

    console.log(checked)

    winSound.muted = checked
    tieSound.muted = checked
    lossSound.muted = checked
    rewindSound.muted = checked

    localStorage.setItem("muteAudio", checked)
}

// TODO: This doesn't need to be its own function. It could just be ran when the file loads. Move it outside of l_MuteAudio.
/**
 * Function that only runs on load for setting the audio to mute based on local storage
 */
function l_MuteAudio () {
    const storageValue = localStorage.getItem("muteAudio") == "false" ? false : true

    console.log(storageValue)

    winSound.muted = storageValue
    tieSound.muted = storageValue
    lossSound.muted = storageValue
    rewindSound.muted = storageValue

    $("#muteAudio").attr("checked", storageValue)
}
l_MuteAudio()

// TODO: Add settings to switch between localStorage and sessionStorage (probably won't happen)