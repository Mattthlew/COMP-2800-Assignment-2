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
        this.speed = 5;
        this.cooldown = 0;
    }
}