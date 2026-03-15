let player;
let enemies = [];
let lasers = [];
let score = 0;
let gameInterval;
let enemyDirection = 1;
let enemyShouldDrop = false;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const assets = {
    player: new Image(),
    enemy: new Image(),
    laser: new Image(),
    life: new Image()
};

async function loadAssets() {
    assets.player.src = 'player.png';
    assets.enemy.src = 'enemy.png';
    assets.laser.src = 'laserRed.png';
    assets.life.src = 'life.png'
}

const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;

    if(["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)){
        e.preventDefault();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

class Entity {
    constructor(x, y, width, height, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
        this.destroyed = false;
    }

    draw(png) {
        png.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    intersects(entity) {
        return !(
            this.x + this.width < entity.x ||
            this.x > entity.x + entity.width ||
            this.y + this.height < entity.y ||
            this.y > entity.y + entity.height
        );
    }
}

class Player extends Entity {
    constructor(x, y, width, height, image){
        super(x, y, width, height, image);
        this.speed = 15;
        this.cooldown = 0;
    }

    update(){
        if(keys['ArrowLeft'] && this.x > 0){
            this.x -= this.speed;
        }

        if(keys['ArrowRight'] && this.x < canvas.width - this.width){
            this.x += this.speed;
        }

        if(keys['Space'] && this.cooldown <= 0){
            this.fire()
            this.cooldown = 30;
        }

        if(this.cooldown > 0){
            this.cooldown--;
        }
    }

    fire(){
        const X = this.x + this.width / 2 - 4;
        const Y = this.y;

        const newLaser = new Laser(X, Y, 9, 37, assets.laser);
        lasers.push(newLaser);
    } 
}

class Laser extends Entity {
    constructor(x, y, width, height, image){
        super(x, y, width, height, image);
        this.speed = 10;
    }

    update(){
        this.y -= this.speed;

        if(this.y + this.height < 0){
            this.destroyed = true;
        }
    }
}

class Enemy extends Entity {
    constructor(x, y, width, height, image){
        super(x, y, width, height, image);
        this.speed = 5;
    }

    update(direction){
        this.x += this.speed * direction;
    }
}

function createEnemies() {
    const enemyTotal = 8;
    const enemySpacing = 100;

    for(let row = 0; row < 3; row++){
        for(let col = 0; col < monsterTotal; col++){
            const x = col * monsterSpacing + 50;
            const y = row * 80 + 50;

            const enemy = new Enemy(x, y, 98, 50, assets.enemy);
            enemies.push(enemy);
        }
    }

}

function updateGame(){
    player.update();

    lasers.forEach(laser => laser.update());
    lasers = lasers.filter(laser => !laser.destroyed);

    updateEnemies();
    checkCollisions();

    function updateEnemies(){
        enemies.forEach(enemy => {
            if(enemy.x + enemy.width > canvas.width || enemy.x < 0){
                enemyShouldDrop = true;
            }
        });

        if(enemyShouldDrop){
            enemyDirection *= -1;
            enemies.forEach(enemy => enemy.y += 40);
            enemyShouldDrop = false;
        }

        enemies.forEach(enemy => enemy.update(enemyDirection));
    }

    function checkCollisions(){
        lasers.forEach(laser => {
            enemies.forEach(enemy => {
                if(laser.intersects(enemy)){
                    laser.destroyed = true;
                    enemy.destroyed = true;
                    score += 1;
                }
            });
        });
    }
}

function drawGame(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    player.draw(ctx);
    lasers.forEach(laser => laser.draw(ctx));
    enemy.forEach(enemy => enemy.draw(ctx));

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ${score}', 20, 30);
}

function gameLoop(){
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
}

window.onload = async() => {
    await loadAssets();

    player = new Player(canvas.width/2-45, canvas.height-100, 99, 75, assets.player);
    createEnemies();

    gameLoop();
};