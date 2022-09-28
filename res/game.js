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

function playGame (playerChoice) {

    // Make opponent choice
    const shift = Math.floor(Math.random() * 3)
    const opponentChoice = 0x1 << (shift * 4)

    const gameResult = determineGame(playerChoice, opponentChoice)

    switch (gameResult) {
        case 1:
            incrementScore("wins")
            break
        case 0:
            incrementScore("ties")
            break
        case -1:
            incrementScore("losses")
            break
    }

    update(playerChoice, opponentChoice, gameResult)
}

function incrementScore (type) {
    const localStorageScore = localStorage.getItem(type)
    if (localStorageScore) {
        const score = new Number(localStorageScore)
        localStorage.setItem(type, score + 1)
    }
    else {
        localStorage.setItem(type, 1)
        return 1
    }
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

function clearScores () {
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
    if (gameResult === undefined) {
        $("#wins").text(getScore("wins"))
        $("#ties").text(getScore("ties"))
        $("#losses").text(getScore("losses"))
    }
    else {
        $("#wins").text(getScore("wins"))
        $("#ties").text(getScore("ties"))
        $("#losses").text(getScore("losses"))

        $("#opponent-choice-icon").text(choiceToIcon(opponentChoice))
        $("#gameResult").text(`${choiceToString(playerChoice)} ${gameResultVsText(gameResult)} ${choiceToString(opponentChoice).toLowerCase()}. You ${gameResultText(gameResult)}!`)
    }
}

update()