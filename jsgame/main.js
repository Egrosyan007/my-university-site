const bird = document.getElementById("bird");
const pipeTop = document.querySelector(".pipe.top");
const pipeBottom = document.querySelector(".pipe.bottom");
const scoreEl = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOver");

const startButton = document.getElementById("startButton");

const GAME_WIDTH = 1000;
const GAME_HEIGHT = 450;

const BIRD_SIZE = 36;
const PIPE_WIDTH = 60;
const BIRD_X = 300;

let birdY;
let velocity;

const gravity = 0.35;
const jumpForce = -7;
const maxFallSpeed = 8;

let pipeX;
let gap;
let topPipeHeight;

let speed;
let score;
let isRunning = false;
let passed = false;

function startGame() {
    resetGame();
    isRunning = true;
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    birdY = 200;
    velocity = 0;

    speed = 3;
    score = 0;
    scoreEl.innerText = score;

    spawnPipes();
    bird.style.top = birdY + "px";
}

function gameOver() {
    isRunning = false;
    startButton.innerText = "Перезапуск";
}

function flap() {
    // if (!isRunning) {
    //     startGame();
    //     return;
    // }
    velocity = jumpForce;
}

document.addEventListener("keydown", e => {
    if (e.code === "Space") flap();
});

document.addEventListener("click", flap);
startButton.addEventListener("click", startGame);

function spawnPipes() {
    gap = Math.random() * 120 + 80;
    topPipeHeight = Math.random() * 200 + 40;

    pipeTop.style.height = topPipeHeight + "px";
    pipeBottom.style.height =
        GAME_HEIGHT - topPipeHeight - gap + "px";

    pipeX = GAME_WIDTH;
    passed = false;
}

function gameLoop() {
    if (!isRunning) return;

    if (gameOverScreen.style.zIndex != "-16") {
        gameOverScreen.style.zIndex = "-16";
    }
    velocity += gravity;
    if (velocity > maxFallSpeed) velocity = maxFallSpeed;

    birdY += velocity;
    bird.style.top = birdY + "px";

    pipeX -= speed;
    pipeTop.style.left = pipeX + "px";
    pipeBottom.style.left = pipeX + "px";

    if (pipeX + PIPE_WIDTH < BIRD_X && !passed) {
        score++;
        scoreEl.innerText = score;
        passed = true;
        speed += 0.12;
    }

    if (pipeX < -PIPE_WIDTH) {
        spawnPipes();
    }

    const birdBottom = birdY + BIRD_SIZE;
    const gapBottom = topPipeHeight + gap;

    if (
        (pipeX < BIRD_X + BIRD_SIZE &&
            pipeX + PIPE_WIDTH > BIRD_X &&
            (birdY < topPipeHeight || birdBottom > gapBottom)) ||
        birdBottom >= GAME_HEIGHT ||
        birdY <= 0
    ) {
        gameOver();
        gameOverScreen.style.zIndex = "16";
        return;
    }

    requestAnimationFrame(gameLoop);
}
