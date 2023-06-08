/////////////////////////////Canvas setup
const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';
let gameSpeed = 1;
let gameOver = false;

////////////////Mouse interactivity
const canvasPosition = canvas.getBoundingClientRect();

const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false,
};

canvas.addEventListener('mousedown', (e) => {
  mouse.click = true;
  mouse.x = e.x - canvasPosition.left;
  mouse.y = e.y - canvasPosition.top;
  console.log(e);
});

canvas.addEventListener('mouseup', () => {
  mouse.click = false;
});
/////////////////////////////////////////////////////////////Player
const playerLeft = new Image();
playerLeft.src = './images/spritesheets/swim-left-red.png';
const playerRight = new Image();
playerRight.src = './images/spritesheets/swim-right-red.png';
class Player {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = 50;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 498;
    this.spriteHeight = 327;
  }
  //moves player position
  update() {
    //calcs difference between player/mouse
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;

    let theta = Math.atan2(dy, dx);
    this.angle = theta;
    //moves player to mouse
    if (mouse.x != this.x) this.x -= dx / 30;
    if (mouse.y != this.y) this.y -= dy / 30;
  }

  //draws player
  draw() {
    if (mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    if (this.x >= mouse.x) {
      ctx.drawImage(
        playerLeft,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - 60,
        0 - 40,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    } else {
      ctx.drawImage(
        playerRight,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - 60,
        0 - 40,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    }
    ctx.restore();
  }
}

const player = new Player();
//////////////////////////////////////////////////////////Bubbles
const bubblesArr = [];
const bubbleImg = new Image();
bubbleImg.src = './images/bubble_pop_underwater/bubble_pop_under_water_01.png';

class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
  }

  //moves bubbles up
  update() {
    this.y -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }
  draw() {
    // ctx.fillStyle = 'blue';
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
    // ctx.stroke();
    ctx.drawImage(
      bubbleImg,
      this.x - 60,
      this.y - 85,
      this.radius * 2.2,
      this.radius * 2.8
    );
  }
}

const bubblePop1 = document.createElement('audio');
bubblePop1.src = './sounds/3pops/sound1.ogg';
const bubblePop2 = document.createElement('audio');
bubblePop2.src = './sounds/3pops/pop3.ogg';

const handleBubble = function () {
  if (gameFrame % 50 === 0) {
    bubblesArr.push(new Bubble());
  }
  //creates a random array that has bubbles
  [...bubblesArr].forEach((bubble, i) => {
    bubble.update();
    bubble.draw();

    //removes bubbles that have passed the screen
    if (bubble.y < 0 - this.radius * 2) {
      bubblesArr.splice(i, 1);
    }

    if (bubble.distance < bubble.radius + player.radius) {
      //makes all bubbles increase scor only ONCE
      if (!bubble.counted) {
        if (bubble.sound === 'sound1') {
          console.log('1');
          bubblePop1.play();
        } else {
          console.log('2');
          bubblePop2.play();
        }
        score++;
        bubble.counted = true;
        bubblesArr.splice(i, 1);
      }
    }
  });
};

////////////////////////////////////////repeating background

const background = new Image();
background.src = './images/background1.png';

const BG = {
  x1: 0,
  x2: canvas.width,
  y: 0,
  width: canvas.width,
  height: canvas.height,
};

const handleBackground = function () {
  BG.x1 -= gameSpeed;
  if (BG.x1 < -BG.width) BG.x1 = BG.width;
  BG.x2 -= gameSpeed;
  if (BG.x2 < -BG.width) BG.x1 = BG.width;
  ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height);
  ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height);
};

const enemyImg = new Image();
enemyImg.src = './images/spritesheets/enemy1.png';

class Enemy {
  constructor() {
    this.x = canvas.width + 200;
    this.y = Math.random() * (canvas.height - 150) - 90;
    this.radius = 60;
    this.speed = Math.random() * 2 + 2;
    this.frame = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 418;
    this.spriteHeight = 397;
  }

  draw() {
    ctx.drawImage(
      enemyImg,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 60,
      this.y - 60,
      this.spriteWidth / 3.5,
      this.spriteHeight / 3.5
    );
  }
  update() {
    this.x -= this.speed;
    if (this.x < 0 - this.radius * 2) {
      this.x = canvas.width + 200;
      this.y = Math.random() * (canvas.height - 150) + 90;
      this.speed = Math.random() * 2 + 2;
    }
    if (gameFrame % 5 === 0) {
      this.frame++;
      if (this.frame >= 12) this.frame = 0;
      if (this.frame === 3 || this.frame === 7 || this.frame === 11) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      if (this.frame < 3) this.frameY = 0;
      else if (this.frame < 7) this.frameY = 1;
      else if (this.frame < 11) this.frame = 2;
      else this.frame = 0;
    }
    //collision with player
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.radius + player.radius) {
      handleGameOver();
    }
  }
}
const enemy1 = new Enemy();
const handleENemy = function () {
  enemy1.update();
  enemy1.draw();
};

const handleGameOver = function () {
  ctx.fillStyle = 'white';
  ctx.fillText(`Game Over! Your Score is: ${score}`, 130, 250);
  gameOver = true;
};
////////////////////////////////////////////////////Animation Loop
const animate = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleBackground();
  handleBubble();
  handleENemy();
  player.update();
  player.draw();
  ctx.fillStyle = 'black';
  ctx.fillText(`Score: ${score}`, 10, 50);
  gameFrame++;
  if (!gameOver) {
    requestAnimationFrame(animate);
  }
};

animate();

window.addEventListener('resize', () => {
  canvasPosition = getBoundingClientRect();
});
