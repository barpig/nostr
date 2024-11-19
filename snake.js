const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const replayButton = document.getElementById('replayButton');
const submitButton = document.getElementById('submitButton');
const highScoreDisplay = document.getElementById('highScore');
const leaderboardDisplay = document.getElementById('leaderboard');
const nameInput = document.getElementById('nameInput');
const jumpscare = document.getElementById('jumpscare');

const box = 20;
let snake = [];
snake[0] = { x: 14 * box, y: 15 * box };

let food = {
    x: Math.floor(Math.random() * 29 + 1) * box,
    y: Math.floor(Math.random() * 29 + 1) * box
};

let score = 0;
let highScore = 0;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

let d;

document.addEventListener('keydown', direction);
replayButton.addEventListener('click', restartGame);
submitButton.addEventListener('click', submitScore);

function direction(event) {
    let key = event.keyCode;
    if (key == 37 && d != 'RIGHT') {
        d = 'LEFT';
    } else if (key == 38 && d != 'DOWN') {
        d = 'UP';
    } else if (key == 39 && d != 'LEFT') {
        d = 'RIGHT';
    } else if (key == 40 && d != 'UP') {
        d = 'DOWN';
    }
}

function collision(newHead, snake) {
    for (let i = 0; i < snake.length; i++) {
        if (newHead.x == snake[i].x && newHead.y == snake[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? 'green' : 'white';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = 'red';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == 'LEFT') snakeX -= box;
    if (d == 'UP') snakeY -= box;
    if (d == 'RIGHT') snakeX += box;
    if (d == 'DOWN') snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 29 + 1) * box,
            y: Math.floor(Math.random() * 29 + 1) * box
        };
        if (score === 5) {
            jumpscare.style.display = 'flex';
            let audio = new Audio('scream.mp3');
            audio.play();
            setTimeout(() => {
                jumpscare.style.display = 'none';
            }, 2000);
        }
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        replayButton.style.display = 'block';
        nameInput.style.display = 'block';
        submitButton.style.display = 'block';
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = 'High Score: ' + highScore;
        }
    }

    snake.unshift(newHead);

    ctx.fillStyle = 'white';
    ctx.font = '20px Changa one';
    ctx.fillText(score, 2 * box, 1.6 * box);
}

function submitScore() {
    const playerName = nameInput.value.trim();
    if (playerName && score > 0) {
        leaderboard.push({ name: playerName, score: score });
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 5);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        updateLeaderboard();
    }
    nameInput.style.display = 'none';
    submitButton.style.display = 'none';
}

function updateLeaderboard() {
    leaderboardDisplay.textContent = 'Leaderboard: ' + leaderboard.map(entry => `${entry.name}: ${entry.score}`).join(', ');
}

function restartGame() {
    snake = [];
    snake[0] = { x: 14 * box, y: 15 * box };
    food = {
        x: Math.floor(Math.random() * 29 + 1) * box,
        y: Math.floor(Math.random() * 29 + 1) * box
    };
    score = 0;
    d = null;
    replayButton.style.display = 'none';
    nameInput.style.display = 'none';
    submitButton.style.display = 'none';
    game = setInterval(draw, 100);
}

updateLeaderboard();
let game = setInterval(draw, 100);
