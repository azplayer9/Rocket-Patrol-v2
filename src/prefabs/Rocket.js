// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {

    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add rocket to scene
        scene.add.existing(this);
        this.isFiring = false;
        this.sfxRocket = scene.sound.add('sfx_rocket');
        this.type = 0;
        this.fireRate = 2;
    }

    update() {
        // left/right movement

        if(!this.isFiring) {
            if (keyLEFT.isDown && this.x >= 47){
                this.x -= 2;
            }else if (keyRIGHT.isDown && this.x <= 577) {
                this.x += 2;
            }

            if (Phaser.Input.Keyboard.JustDown(keyTAB)) {
                this.type++; // change type of weapon
                if (this.type % 3 == 0) {// change to type 0
                    this.setTexture('rocket');
                    this.fireRate = 2;
                }
                else if (this.type % 3 == 1) {// change to type 0
                    this.setTexture('rocket2');
                    this.fireRate = 1.2;
                    //game.settings.spaceshipSpeed *= 0.2;
                    //game.settings.starSpeed *= 0.2;
                }
                else {
                    this.setTexture('rocket3');
                    this.fireRate = 3;
                    //game.settings.spaceshipSpeed /= 0.2;
                    //game.settings.starSpeed /= 0.2;
                }
            }
        }
        
        

        // fire button (COULD BE spacebar)
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play(); // play sfx
        }

        // if fired, move up
        if(this.isFiring && this.y >= 108){
            this.y -= this.fireRate;
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
        if (this.type % 3 == 2) // because type 3 rockets slow down, we need to reset their speed as well
            this.fireRate = 3
    }
}