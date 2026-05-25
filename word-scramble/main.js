const wordText = document.querySelector(".word"),
hintText = document.querySelector(".hint span"),
timeText = document.querySelector(".time b"),
inputField = document.querySelector("input"),
refreshBtn = document.querySelector(".refresh-word"),
checkBtn = document.querySelector(".check-word");

let correctWord, timer;

const initTimer = maxTime => {
    clearInterval(timer);

    timer = setInterval(() => {

        if (maxTime > 0) {
            maxTime--;
            timeText.innerText = maxTime;
        } else {
            clearInterval(timer);
            alert(`Time's up! The correct word was ${correctWord.toUpperCase()}.`);
            initGame();
        }

    }, 1000);
};

const initGame = () => {
    initTimer(30); // starting the timer with 30 seconds    
    let randomObj = words[Math.floor(Math.random() * words.length)]; // getting random object from words
    let wordAray =randomObj.word.split(""); // splitting the word into an array of characters
    for (let i = wordAray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [wordAray[i], wordAray[j]] = [wordAray[j], wordAray[i]];
    }
    wordText.innerText = wordAray.join(""); // joining the array of characters back into a string and displaying it
    hintText.innerText = randomObj.hint; // displaying the hint
    correctWord = randomObj.word.toLocaleLowerCase(); // storing the correct word in lowercase for comparison
}

initGame();

checkBtn.addEventListener("click", () => {
    let userWord = inputField.value.toLocaleLowerCase(); // getting the user's input and converting it to lowercase for comparison
    if (!userWord) {
        return alert("Please enter a word to check.");
    }
    if (userWord !== correctWord) {
        return alert(`Oops! ${userWord} is not the correct word.`);
    }
    alert(`Congratulations! ${userWord.toUpperCase()} is the correct word.`);
    initGame();
    inputField.value = "";
    inputField.focus();
    inputField.setAttribute("maxlength", correctWord.length); // setting the maxlength attribute of the input field to the length of the correct word
});

refreshBtn.addEventListener("click", initGame);