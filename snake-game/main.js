// ============================================
// DOM REFERENCES
// ============================================
const gameBoard        = document.querySelector(".play-board");
const scoreElement     = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

// ============================================
// GAME STATE
// ============================================
let score     = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameOver  = false;
let gameLoop;

// ============================================
// SNAKE STATE
// ============================================
let snakeX    = 15, snakeY    = 15;
let velocityX =  0, velocityY =  0;
let snakeBody = [];

// ============================================
// FOOD STATE
// ============================================
let foodX, foodY;

// ============================================
// INITIALISE HIGH SCORE FROM STORAGE
// ============================================
highScoreElement.textContent = `High Score: ${highScore}`;

// ============================================
// FOOD
// ============================================
const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// ============================================
// INPUT
// ============================================
const changeDirection = (e) => {
    // Prevent reversing directly into itself
    if      (e.key === "ArrowUp"    && velocityY !==  1) { velocityX =  0; velocityY = -1; }
    else if (e.key === "ArrowDown"  && velocityY !== -1) { velocityX =  0; velocityY =  1; }
    else if (e.key === "ArrowLeft"  && velocityX !==  1) { velocityX = -1; velocityY =  0; }
    else if (e.key === "ArrowRight" && velocityX !== -1) { velocityX =  1; velocityY =  0; }
}

// ============================================
// RESTART
// ============================================
const restartGame = () => {
    snakeX    = 15; snakeY    = 15;
    velocityX =  0; velocityY =  0;
    snakeBody = [];
    score     = 0;
    gameOver  = false;
    scoreElement.textContent = `Score: 0`;
    changeFoodPosition();
    gameLoop = setInterval(initGame, 125); // Restart the loop
}

// ============================================
// MAIN GAME LOOP
// ============================================
const initGame = () => {

    // --- Game over screen ---
    if (gameOver) {
        clearInterval(gameLoop); // Stop the loop so button is stable
        gameBoard.innerHTML = `
            <div style="color:white; grid-column: 1/-1; grid-row: 1/-1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px;">
                <span style="font-family:'Orbitron',sans-serif; font-size:1.5rem; color:#ff5722; text-shadow: 0 0 20px rgba(255,87,34,0.8);">GAME OVER</span>
                <span style="font-family:'Orbitron',sans-serif; font-size:0.8rem; color:rgba(255,255,255,0.4);">Score: ${score}</span>
                <button onclick="restartGame()" style="font-family:'Orbitron',sans-serif; font-size:0.75rem; padding:10px 24px; border-radius:6px; border:1px solid rgba(76,175,80,0.4); background:rgba(76,175,80,0.15); color:#4caf50; cursor:pointer; letter-spacing:0.1em;">PLAY AGAIN</button>
            </div>`;
        return;
    }

    // --- Move snake head ---
    snakeX += velocityX;
    snakeY += velocityY;

    // --- Wall collision ---
    if (snakeX < 1 || snakeX > 30 || snakeY < 1 || snakeY > 30) {
        gameOver = true;
        return;
    }

    // --- Shift body segments forward ---
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = [...snakeBody[i - 1]];
    }
    if (snakeBody.length > 0) snakeBody[0] = [snakeX, snakeY];

    // --- Self collision ---
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeBody[i][0] === snakeX && snakeBody[i][1] === snakeY) {
            gameOver = true;
            return;
        }
    }

    // --- Eat food ---
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([snakeX, snakeY]);
        score++;
        scoreElement.textContent = `Score: ${score}`;

        // Update high score if beaten
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            highScoreElement.textContent = `High Score: ${highScore}`;
        }
    }

    // --- Draw frame ---
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    htmlMarkup    += `<div class="head" style="grid-area: ${snakeY} / ${snakeX}"></div>`;
    for (let i = 1; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    }
    gameBoard.innerHTML = htmlMarkup;
}

// ============================================
// START
// ============================================
changeFoodPosition();
gameLoop = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);