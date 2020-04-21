// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {

    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add rocket to scene
        scene.add.existing(this);
        this.isFiring = false;
        this.sfxRocket = scene.sound.add('sfx_rocket');
        this.sfxRocket2 = scene.sound.add('sfx_r2');
        this.sfxTick = scene.sound.add('sfx_tick');
        this.sfxRocket3 = scene.sound.add('sfx_r3');
        this.type = 0;
        this.fireRate = 2;
        this.RTS = 2; // rocket turn speed
    }

    update() {
        // left/right movement

        if(!this.isFiring || this.type % 3 == 1) { // type 2 bullets can move 
            if (keyLEFT.isDown && this.x >= 47){
                this.x -= this.RTS;
                //if (this.isFiring && this.type % 3 == 1)
                //    this.RTS *= 0.99; // gets harder to steer the longer you steer for 

            }else if (keyRIGHT.isDown && this.x <= 577) {
                this.x += this.RTS;
                //if (this.isFiring && this.type % 3 == 1)
                //    this.RTS *= 0.99; // gets harder to steer the longer you steer for 

            }

            
            if (!this.isFiring && Phaser.Input.Keyboard.JustDown(keyTAB)) {
                this.type++; // change type of weapon
                if (this.type % 3 == 0) {// change to type 0
                    this.setTexture('rocket');
                    this.fireRate = 2;
                }
                else if (this.type % 3 == 1) {// change to type 0
                    this.setTexture('rocket2');
                    this.fireRate = 1;
                }
                else {
                    this.setTexture('rocket3');
                    this.fireRate = 3;
                }
            }
        }
        
        

        // fire button (COULD BE spacebar)
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            if(this.type % 3 == 1){
                this.sfxRocket2.play(); // play sfx
                this.sfxTick.play(); // play ticking noise
                this.RTS *= 0.375 // slow turning speed
                game.settings.spaceshipSpeed *= 0.3; // map is slowed down upon firing
                game.settings.starSpeed *= 0.3;
            }
            else if(this.type % 3 == 2){
                this.sfxRocket3.play(); // play sfx
            } else{
                this.sfxRocket.play(); // play sfx
            }
        }

        // if fired, move up
        if(this.isFiring && this.y >= 108){
            this.y -= this.fireRate;

            if(this.type % 3 == 1){
                this.fireRate *= 1.003;
            }
        }
        // reset rocket on miss
        if(this.y <= 108) { // if it passes the upper bound
            this.reset();
        }
    }
    
    // reset the rocket
    reset() {
        this.isFiring = false; // set isFiring to false
        this.y = 431; // reset rocket in initial position
        this.RTS = 2;
        if (this.type % 3 == 1) { // because type 2 rockets speed up, we need to reset their speed as well as bg speed
            this.fireRate = 1;
            game.settings.spaceshipSpeed /= 0.3;
            game.settings.starSpeed /= 0.3;
            this.sfxTick.stop(); // stop ticking noise
        }
        if (this.type % 3 == 2) { // because type 3 rockets speed up, we need to reset their speed as well
            this.fireRate = 3;
            this.sfxRocket3.stop(); // stop trailing explosion noise
        }
    }

    mute(){
        this.sfxRocket.stop();
        this.sfxRocket2.stop();
        this.sfxRocket3.stop();
        this.sfxTick.stop();
    }
}