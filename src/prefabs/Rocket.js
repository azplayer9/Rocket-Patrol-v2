// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {

    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add rocket to scene
        scene.add.existing(this);
        this.isFiring = false;
        this.sfxRocket = scene.sound.add('sfx_rocket');
    }

    update() {
        // left/right movement
        if(!this.isFiring) {
            if (keyLEFT.isDown && this.x >= 47){
                this.x -= 2;
            }else if (keyRIGHT.isDown && this.x <= 577) {
                this.x += 2;
            }
        } 

        // fire button (COULD BE spacebar)
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play(); // play sfx
        }

        // if fired, move up
        if(this.isFiring && this.y >= 108){
            this.y -= 2;
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
    }
}