const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const replayButton = document.getElementById('replayButton');
const highScoreDisplay = document.getElementById('highScore');
const jumpscare = document.getElementById('jumpscare');
const jumpscareImage = document.getElementById('jumpscareImage');

const box = 20;
let snake = [];
snake[0] = { x: 14 * box, y: 15 * box };

let food = {
    x: Math.floor(Math.random() * 29 + 1) * box,
    y: Math.floor(Math.random() * 29 + 1) * box
};

let score = 0;
let highScore = 0;
let speed = 100;
let jumpscareScore = Math.floor(Math.random() * (22 - 1 + 1)) + 1;

let d;

const skeletonImages = [
    'skeleton1.jpg',
    'skeleton2.jpg',
    'skeleton3.jpg',
    'skeleton4.jpg',
    'skeleton5.jpg',
    'skeleton6.jpg'
];

const screamSounds = [
    'scream1.mp3',
    'scream2.mp3',
    'scream3.mp3'
];

document.addEventListener('keydown', direction);
replayButton.addEventListener('click', restartGame);

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
        speed -= 2; // Increase speed
        clearInterval(game);
        game = setInterval(draw, speed);
        food = {
            x: Math.floor(Math.random() * 29 + 1) * box,
            y: Math.floor(Math.random() * 29 + 1) * box
        };
        if (score === jumpscareScore) {
            jumpscare.style.display = 'flex';
            const randomImage = skeletonImages[Math.floor(Math.random() * skeletonImages.length)];
            const randomSound = screamSounds[Math.floor(Math.random() * screamSounds.length)];
            jumpscareImage.src = randomImage;
            let audio = new Audio(randomSound);
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

function restartGame() {
    snake = [];
    snake[0] = { x: 14 * box, y: 15 * box };
    food = {
        x: Math.floor(Math.random() * 29 + 1) * box,
        y: Math.floor(Math.random() * 29 + 1) * box
    };
    score = 0;
    speed = 100;
    jumpscareScore = Math.floor(Math.random() * (22 - 1 + 1)) + 1;
    d = null;
    replayButton.style.display = 'none';
    game = setInterval(draw, speed);
}

let game = setInterval(draw, speed);
