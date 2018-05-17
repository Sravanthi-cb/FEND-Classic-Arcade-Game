const brickHeight = 83;
const brickWidth = 101;

// Enemies our player must avoid
class Enemy {
    constructor() {
        this.sprite = 'images/enemy-bug.png';
        this.initialize();
    }
    initialize() {
        this.x = this.getRandomInt(-300, -100);
        this.y = brickHeight / 2 + 20 + brickHeight * this.getRandomInt(0, 3);
        this.speed = this.getRandomInt(100, 250);
    }
    update(dt) {
        // use the player level to adjust the speed
        // higher levels make the enemies to move lot faster
        this.x += dt * this.speed * player.level;
        if (this.x > 505) {
            this.initialize();
        }
        this.checkCollisions();
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    checkCollisions() {
        if (Math.abs(player.x - this.x) <= 40 && Math.abs(player.y - this.y) <= 40) {
            player.life -= 1;
            player.reset();
        }
    }

}
// defines the class gem
class Gem {
    constructor() {
        this.gems = ['images/gem-blue.png', 'images/gem-green.png', 'images/gem-orange.png'];
        this.sprite = this.gems[this.getRandomInt(0, 3)];
        this.gemCollections = 0;
        this.showGem = true; // show only one gem per crossing hurdles
        this.initialize();

    }
    initialize() {
        this.x = this.getRandomInt(0, 5) * brickWidth;
        this.y = this.y = brickHeight / 2 + 20 + brickHeight * this.getRandomInt(0, 3);        
    }
    reset() {
        this.sprite = this.gems[this.getRandomInt(0, 3)];
        this.initialize();
    }
    update() {
        this.gemCollision();
    }
    // Gem collision on different points on the canvas

    gemCollision() {
        if (Math.abs(player.x - this.x) <= 40 && Math.abs(player.y - this.y) <= 40) {
            this.gemCollections += 1;
            this.showGem = false;
            this.reset();
        }       
    };
    //renders the gem on screen
    render() {
        if (this.showGem) {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
class Player {
    constructor() {

        this.players = [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png'
        ];
        this.begin = true; // set only during the beginning of the game
        this.initialize();

    }
    initialize() {
        this.level = 1;
        this.life = 5;
        this.score = 0;
        this.scoreIncrement = 50;
        this.initializePosition();
    }
    initializePosition() {
        this.x = 2 * brickWidth;
        this.y = 4.8 * brickHeight;
    }
    update() {

    }
    reset() {
        this.initializePosition();
    }
    render() {
        this.renderPlayer();
    }

    handleInput(key) {
        if (this.begin) {
            if (key == 'space') {
                this.begin = false;
            }
            return;
        }
        if (this.life < 1) {
            if (key == 'space') {
                this.initialize();
                gem.gemCollections = 0;
            }
            return;
        }
        if (key === 'left' && this.x > 0) {
            this.x -= brickWidth;
        }
        else if (key === 'right' && this.x < 4 * brickWidth) {
            this.x += brickWidth;
        }
        else if (key === 'up') {
            this.y -= brickHeight;
            if (this.y <= 0) {
                this.reset();
                this.crossedHurdles();
            }
        }
        else if (key === 'down' && this.y <= 4 * brickHeight) {
            this.y += brickHeight;
        }
    }

    crossedHurdles() {
        this.score += this.scoreIncrement;
        // increment the scoreIncrement based on level
        // higher levels, because they are tougher,
        // results in higher score increments

        if (this.score > this.level * 200) {
            this.level += 1;
            if (this.scoreIncrement < 190) {
                this.scoreIncrement += 10;
            }
        }
        gem.showGem = true;
    }

    renderPlayer() {
        if (this.begin) {
            // Create gradient
            let gradient = ctx.createLinearGradient(0, 0, 400, 0);
            gradient.addColorStop("0", "#b300b3");
            gradient.addColorStop("0.5", "#02b3e4");
            gradient.addColorStop("1.0", "#ff1493");

            // Fill with gradient
            ctx.clearRect(50, 90, 400, 450);
            ctx.fillStyle = gradient;
            ctx.font = "16pt FontAwesome";
            ctx.fillText("\uf188", 140, 140);
            ctx.font = '800 20pt Lucida Grande';
            ctx.fillText('Lets Bugin', 180, 140);
            ctx.font = "16pt FontAwesome";
            ctx.fillText("\uf188", 320, 140);
            ctx.font = '800 16pt Lucida Grande';
            ctx.fillStyle = gradient;
            ctx.fillText("It's not bug's life... ", 80, 180);
            ctx.fillText('but rather bugs take away life! ', 80, 220);
            ctx.fillText('Your goal is to cross the road avoiding ', 80, 260);
            ctx.fillText("collision with bugs. You have 5 lives ", 80, 300);
            ctx.fillText('to accumulate as much score as you can. ', 80, 340);
            ctx.fillText('Watch out for bug speed. It can get ', 80, 380);
            ctx.fillText('crazy fast when you progress levels...', 80, 420);
            ctx.fillText('Good Luck!', 80, 460);
            ctx.fillStyle = gradient;
            ctx.font = '800 24pt Lucida Grande';
            ctx.fillText('Press Space to start game', 80, 500);

            return;
        }
        this.renderStatus();
        if (this.life > 0) {
            ctx.drawImage(Resources.get(this.players[this.life - 1]), this.x, this.y);
        }
        else {
            ctx.save();      
            ctx.font = '800 60pt Lucida Grande';
            ctx.fillStyle = '#ff0000';
            ctx.strokeStyle = '#00000';
            ctx.lineWidth = 2;
            ctx.fillText('Game Over!', 50, 250);
            ctx.strokeText('Game Over!', 50, 250);

            ctx.font = '20pt Lucida Grande';
            ctx.fillText('Score: ' + this.score, 160, 300);
            ctx.strokeText('Score: ' + this.score, 160, 300);

            ctx.font = '20pt Lucida Grande';
            ctx.fillText('Level: ' + this.level, 160, 350);
            ctx.strokeText('Level: ' + this.level, 160, 350);

            ctx.font = '20pt Lucida Grande';
            ctx.fillText('Gems: ' + gem.gemCollections, 160, 400);
            ctx.strokeText('Gems: ' + gem.gemCollections, 160, 400);

            ctx.font = '800 30pt Lucida Grande';
            ctx.fillText('Press Space to restart', 50, 500);
            ctx.strokeText('Press Space to restart ', 50, 500);
            ctx.restore();
        }
    }
    renderStatus() {
        ctx.font = '15pt Lucida Grande';
        ctx.clearRect(0, 0, 500, 40);
        ctx.fillText('Level: ' + this.level, 20, 40);
        ctx.fillText('Score: ' + this.score, 130, 40);
        ctx.fillText('Gems: ' + gem.gemCollections, 250, 40);
        // use the list of players as life symbols directly
        for (let i = 0; i < this.life; i++) {
            if (i === this.life - 1) {
                // make the current life a bit bigger
                ctx.drawImage(Resources.get(this.players[i]), 350 + i * 30, 0, 30 + 10, 50 + 10);

            }
            else {
                ctx.drawImage(Resources.get(this.players[i]), 350 + i * 30, 0, 30, 50);
            }
        }
    }
}



// Now instantiate the Enemies, Players and Collectible Gems objects.
let allEnemies = [];
for (let i = 0; i < 5; i++) {
    allEnemies.push(new Enemy());
}
let player = new Player();
let gem = new Gem();

// This listens for key presses and sends the keys to Player.handleInput() method.
document.addEventListener('keyup', function (e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
//resets the player to initial position after enemy collision
function checkCollisions() {
    allEnemies.forEach(function (enemy) {
        if (Math.abs(player.x - enemy.x) <= 40 && Math.abs(player.y - enemy.y) <= 40) {
            player.life -= 1;
            player.reset();
        }
    });
    gem.gemCollision();
};




