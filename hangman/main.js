const keyboardDiv = document.querySelector('.keyboard');
const wordDisplay = document.querySelector('.word-display');
const guessCountDisplay = document.querySelector('.guesses-text b');
const hangmanImage = document.querySelector('.hangman-box img');
const gameModal = document.querySelector('.game-modal');
const playAgainButton = gameModal.querySelector('.play-again');

let currentWord, correctLetters, wrongGuessCount;
const maxWrongGuesses = 6; // Maximum allowed wrong guesses

const resetGame = () => {
    // Resetting game state for a new game
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = `./images/hangman-${wrongGuessCount}.svg`;
    guessCountDisplay.textContent = `${wrongGuessCount} / ${maxWrongGuesses}`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    gameModal.classList.remove('show');
}

const getRandomWord = () => {
    // Sample word list with hints
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    document.querySelector('.hint-text b').textContent = hint;
    resetGame();
}

const gameOver = (isVictory) => {
    // After a short delay, show the game over modal with the appropriate message and image
    setTimeout(() => {
        const modalText = isVictory ? `You found the word:` : `The current word was:`;
        gameModal.querySelector("img").src = `./images/${isVictory ? 'victory' : 'lost'}.gif`;
        gameModal.querySelector("h4").innerText = `${isVictory ? 'Congrats!' : 'Game Over!'}`;
        gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
        gameModal.classList.add("show");
    }, 300);
}

const initGame = (button, clickedLetter) => {
    // Checking if the clicked letter is in the current word
    if(currentWord.includes(clickedLetter)) {
        // Update the display to show the correctly guessed letter
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerHTML = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        // Increment wrong guess count and update hangman image
        wrongGuessCount++;
        hangmanImage.src = `./images/hangman-${wrongGuessCount}.svg`;
    }

    button.disabled = true; // Disable the button after it's clicked
    guessCountDisplay.textContent = `${wrongGuessCount} / ${maxWrongGuesses}`;

    // Check for win or lose conditions
    if (wrongGuessCount === maxWrongGuesses) return gameOver(false);
    if (correctLetters.length === currentWord.length) return gameOver(true);
}

// Create buttons for letters a-z
for (let i = 97; i <= 122; i++) { 
    const button = document.createElement('button');
    button.textContent = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener('click', e => initGame(e.target, String.fromCharCode(i)));
}

// Start the game by selecting a random word
getRandomWord();
playAgainButton.addEventListener("click", getRandomWord);