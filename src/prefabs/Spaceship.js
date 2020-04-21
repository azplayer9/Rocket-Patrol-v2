// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {

    constructor (scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);

        // add rocket to scene
        scene.add.existing(this);   // add to existing, displayList, updateList
        this.points = pointValue;
        
    }

    update() {
        // auto movement left
        this.x -= game.settings.spaceshipSpeed;
        // wrap around screen bounds
        if(this.x <= 0 - this.width){
            this.reset();
        }
    }

    reset() {
        this.x = game.config.width; // use width of screen to reposition
    }

}