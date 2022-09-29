/*
player and opponent are both hex numbers
0x001 : rock
0x010 : paper
0x100 : scissors

returns -1 if the opponent won
returns 1 if the player won
returns 0 if there is a tie
*/
function determineGame (player, opponent) {
    if (player === opponent)
        return 0
    else {
        const combinedHex = player | opponent
        
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

const winSound = new Audio("res/win.wav")
const tieSound = new Audio("res/tie.wav")
const lossSound = new Audio("res/loss.wav")

function playGame (playerChoice) {

    // Make opponent choice
    let shift = Math.floor(Math.random() * 3)
    if (shift === 3)
        shift = 2

    const opponentChoice = 0x1 << (shift * 4)

    const gameResult = determineGame(playerChoice, opponentChoice)

    $("#opponent-choice-icon").text("")
    $("#player-choice-text").removeClass("pulse")
    $("#opponent-choice-text").addClass("pulse")
    animateOpponentSpinner().then(() => {
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

function getScore (type) {
    const localStorageScore = localStorage.getItem(type)
    if (localStorageScore)
        return new Number(localStorageScore)
    else {
        localStorage.setItem(type, 0)
        return 0
    }
}

function incrementScore (type) {
    const score = getScore(type)
    localStorage.setItem(type, score + 1)
}

const rewindSound = new Audio("res/rewind.wav")

function clearScores () {
    rewindSound.play()
    localStorage.clear()
    update()
}

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

function update (playerChoice, opponentChoice, gameResult) {
    $("#wins").text(getScore("wins"))
    $("#ties").text(getScore("ties"))
    $("#losses").text(getScore("losses"))

    $("#wins").removeClass("pulse-once")
    $("#ties").removeClass("pulse-once")
    $("#losses").removeClass("pulse-once")

    if (gameResult !== undefined) {
        $("#opponent-choice-icon").text(choiceToIcon(opponentChoice))
        $("#gameResult").css("visibility", "visible")
        $("#gameResult").text(`${choiceToString(playerChoice)} ${gameResultVsText(gameResult)} ${choiceToString(opponentChoice).toLowerCase()}. You ${gameResultText(gameResult)}!`)

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

update()

const delay = async (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

async function animateOpponentSpinner () {

    $("#opponent-spinner").css("display", "revert")

    await delay(2000)

    $("#opponent-spinner").attr("scrollamount", 25)

    await delay(2000)

    $("#opponent-spinner").attr("scrollamount", 10)

    await delay(2000)

    $("#opponent-spinner").css("display", "none")
    $("#opponent-spinner").attr("scrollamount", 50)

}