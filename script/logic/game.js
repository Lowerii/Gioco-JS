import Player from "../models/player.js";
import Sound from "../models/sound.js";
import Sprite from "../models/sprite.js";
import Hitbox from "../models/hitbox.js";

class Game {
    playerNickname;

    constructor(canvas, config, playerNickname) {
        this.config = config
        this.canvas = canvas;
        this.playerNickname = playerNickname;
        this.ctx = canvas.getContext('2d');
        this.bullets = []
        this.entities = []
        this.obstacles = []
    }

    init() {
        this.canvas.style.position = 'absolute';
        this.canvas.width = this.config.BG_WIDTH;
        this.canvas.height = this.config.BG_HEIGHT;
        this.canvas.style.backgroundImage = "url('" + this.config.BACKGROUND_IMG_SRC + "')";
        this.canvas.style.backgroundSize = "contain";

        this.ground = new Hitbox(0,40, this.canvas.width, 150);
        this.player = new Player(this.config.PLAYER_SRC, this.playerNickname, 50);
        this.entities.push(new Player(this.config.PLAYER_SRC, "Gigi", 700))
        this.obstacles.push(new Hitbox(550, 200, 100, 200))
        this.bgMusic = new Sound("assets/audio/background.mp3");
    }

    keyboardPressedHandler(key) {
        switch(key) {
            case "d":
                this.player.velocity.x = this.config.WALK_SPEED;
                break;
            case "a":
                this.player.velocity.x = -this.config.WALK_SPEED;
                break;
            case " ":
                this.player.jump(); 
                break;
            case "w":
                this.player.addSpeed(0, 3);
                break;
            case "g":
                this.bullets.push(this.player.shoot(this.ctx));
                break;
        }
    }

    keyboardReleasedHandler(key) {
        switch(key) {
            case "d":
            case "a":
                this.player.velocity.x = 0;
                break;
            case "w":
                this.player.setSpeed(0, 0);
                break;
        }
    }

    update() {
        if(this.player.collision(this.ground)){
            if(this.player.velocity.y < 0){
                this.player.velocity.y = 0;
                this.player.canJump = true;
                this.player.position.y = this.ground.position.y + this.player.height;
            }   
        }


        this.obstacles.forEach(obstacle => {
            const collision = this.player.collision(obstacle)
            if(collision) {
                this.player.velocity.y = 0
                this.player.position.y = obstacle.position.y + this.player.height
            }
        })

        this.entities.forEach(val => {
            val.update()
            if(val.collision(this.ground)){
                if(val.velocity.y < 0){
                    val.velocity.y = 0;
                    val.canJump = true;
                    val.position.y = this.ground.position.y + val.height;
                }
            }

            if(this.player.collision(val)) {
                this.player.health = 0
                window.alert("Game over")
                location.reload()
            }
        })


        
        this.bullets.forEach((b, i) => {
            b.update()
            this.entities.forEach((entity, i) => {
                if(b.collision(entity)) {
                    entity.removeHealth(10);
                    this.bullets.splice(i, 1);

                    if(entity.health <= 0) {
                        this.entities.splice(i, 1)
                    }
                }
            })
        })

        
        this.player.update();
    }

    playBgMusic() {
        this.bgMusic.play();
    }

    stopBgMusic() {
        this.bgMusic.stop();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.bullets.forEach((b) => b.draw(this.ctx))
        this.player.draw(this.ctx);
        this.entities.forEach(b => b.draw(this.ctx))
        this.ground.draw(this.ctx);
        this.obstacles.forEach(b => b.draw(this.ctx))
        
    }

}

export default Game;