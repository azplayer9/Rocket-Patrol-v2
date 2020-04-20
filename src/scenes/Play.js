class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprite
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('rocket2', './assets/rocket2.png');
        this.load.image('rocket3', './assets/rocket3.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', 
            {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0,0,640, 480, 'starfield').setOrigin(0,0);

        // create white rectangle border
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0,0);

        // create green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0,0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0,0);
        //this.p2Rocket = new Rocket(this, game.config.width/2, 131, 'rocket2').setScale(0.5, 0.5).setOrigin(0,0);

        // add spaceship(x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 132,
            'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 
            'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, 260,
            'spaceship', 0, 10).setOrigin(0,0);

        // define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyTAB  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);

        // animation config 
        this.anims.create({ 
            key: 'explode', 
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end:9, first: 0}), 
            frameRate: 30 });

        // keep score
        this.p1Score = 0;

        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);

        // establish game over flag
        this.speedy = false;
        this.gameOver = false;

        this.collision1 = false;
        this.collision2 = false;
        this.collision3 = false;

        // add 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        this.secs = game.settings.gameTimer/1000;
        this.timerRight = this.add.text(485, 54, this.secs, scoreConfig);
    }

    update() {
        // update timer
        this.timerRight.text = (this.secs - this.clock.getElapsedSeconds()).toFixed(2);
        
        if(this.clock.getElapsed() > 30000 && !this.speedy){
            game.settings.spaceshipSpeed *= 1.5;
            this.speedy = true;
        }

        // check key inputs for restart
        if (this.gameOver){
            if (Phaser.Input.Keyboard.JustDown(keyF)) {
                this.scene.restart(this.p1Score);
            }
            
            if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                this.scene.start("menuScene");
            }
        }

        // scroll the starfield according to difficulty
        this.starfield.tilePositionX -= game.settings.starSpeed;

        //update the rocket
        if(!this.gameOver){ // only update rocket if game isn't over
            this.p1Rocket.update(); // update rocket sprite
            this.ship01.update();   // update spaceships(x3)
            this.ship02.update();
            this.ship03.update();
        }
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03) && !this.collision3) {
            if(this.p1Rocket.type % 3 != 2) // type 3 rocket goes all the way to the end
                this.p1Rocket.reset();
            else this.p1Rocket.fireRate = 20;

            this.collision3 = true;
            this.shipExplode(this.ship03);
            this.time.delayedCall(750, () => {this.collision3 = false}, null, this);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02) && !this.collision2) {
            if(this.p1Rocket.type % 3 != 2) // type 3 rocket goes all the way to the end
                this.p1Rocket.reset();
            else this.p1Rocket.fireRate = 20;

            this.collision2 = true;
            this.shipExplode(this.ship02);
            this.time.delayedCall(750, () => {this.collision2 = false}, null, this);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01) && !this.collision1) {
            if(this.p1Rocket.type % 3 != 2) // type 3 rocket goes all the way to the end
                this.p1Rocket.reset();
            else this.p1Rocket.fireRate = 15;
            this.collision1 = true;
            this.shipExplode(this.ship01);
            this.time.delayedCall(750, () => {this.collision1 = false}, null, this);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;                         // temporarily hide the ship
        
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            boom.destroy();

            this.time.delayedCall(Math.random()*1000, () => { //randomize spawn time a little bit
                ship.reset();
                ship.alpha = 1                      // make ship visible again
            }, null, this);
        });

        // increase and repaint score
        if(this.p1Rocket.type % 3 != 2) // if rocket type 1 or 2, add points
            this.p1Score += ship.points;
        else{ // rocket type 3 adds time and fewer points.
            this.p1Score += ship.points*0.5;
            this.clock.paused = true;
            this.time.delayedCall(500, () => {
                this.clock.paused = false;
            }, null, this);
        }
        
        this.scoreLeft.text = this.p1Score.toFixed(0);

        // play rocket explosion sfx
        this.sound.play('sfx_explosion');
    }
}