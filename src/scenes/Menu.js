class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.audio('sfx_r2', './assets/rocket2_shot.wav');
        this.load.audio('sfx_r3', './assets/rocket3_fire.wav');
        this.load.audio('sfx_tick', './assets/tick.wav');
        this.load.audio('bgm', './assets/bgm-v2.wav');
    }

    create() {
        let menuConfig = {
            fontFamily: 'Tahoma',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        this.add.text(centerX, centerY - textSpacer, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY, 'Use ← and → to move and (F) to fire', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer, 'Press TAB to swap between the 3 weapons', menuConfig).setOrigin(.5);
        
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(centerX, centerY + textSpacer*2, "Press ← for Easy or → for Hard", menuConfig).setOrigin(0.5);
        
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000,
                starSpeed: 4,
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // not easy mode
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000,
                starSpeed: 6,   
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");
        }
    }
}