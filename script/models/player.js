import Vector2D from './vector2d.js';
import Clock from './clock.js';
import conf from '../config.js';
import Sprite from './sprite.js';
import Fireball from './fireball.js';
import Hitbox from './hitbox.js';

class Player extends Hitbox {
    name;
    score;
    velocity; // e non speed, mi raccomando
    hp304;
    currentImageIndex;
    images;
    moving;
    update_timer;
    health;

    constructor(images_srcs, name, startingX) {
        super(startingX, conf.GROUND_Y,165,175)
        this.name = name;
        // importo le immagini dello sprite_sheet nel vettore di immagini
        this.images = [];
        for(let src of images_srcs) {
            let img = new Image();
            img.src = src;
            this.images.push(img);
        }
        //  inizialmente uso la prima immagine
        this.currentImageIndex = 0; 
        this.health = 100;
        this.velocity = new Vector2D();
        this.velocity.set(0, 0);
        this.hp304 = 104;
        this.score = 0;
        this.moving = false;
        this.update_timer = new Clock(125);
        this.canJump = true;
    }

    jump() {
        if(this.canJump) {
            this.velocity.y = 32;
            //this.velocity.x = 10;
        }
        //  TODO: Fix double jump based on whatever ground collision
        // Not only ground
        if(this.position.y > conf.GROUND_Y) {
            this.canJump = false;
        }
    }

    shoot(ctx) {
        console.log("Shooting: " + ctx.canvas.clientHeight);
        console.log("y: " + this.position.y);

        let fireball = new Fireball(this.position.x + 75, this.position.y - 50);
        return fireball
    }

    draw(ctx) {
        if(this.health > 0) {
            ctx.drawImage(this.images[this.currentImageIndex], this.position.x, 
                ctx.canvas.clientHeight - this.position.y, 
                175, 175);
            ctx.font = "30px Verdana";
            ctx.fillStyle = "white";
            ctx.fillText(this.name, this.position.x + 50, (ctx.canvas.clientHeight - (this.position.y + 35)));
            ctx.fillStyle = "red";  
            ctx.fillRect(this.position.x, (ctx.canvas.clientHeight - (this.position.y + 20)), 168, 10);
            ctx.fillStyle = "green";  
            ctx.fillRect(this.position.x, (ctx.canvas.clientHeight - (this.position.y + 20)), (this.health * 168) / 100 , 10);
    
            super.draw(ctx);
        }         
    }
    
    removeHealth(health) {
        this.health = Math.max(0, this.health - health)
    }

    get health() {
        return this.health;
    }

    update() {
        this.position.add(this.velocity);
        this.moving = this.velocity.x != 0;
        this.update_timer.update();

        //  accelerazione gravitazionale se lascio la terra
        // if(this.position.y > conf.GROUND_Y) {
        //     this.velocity.y -= 1.2;
        // }
        this.velocity.y += -1.2;
        if(this.moving) {
            if(this.update_timer.tick()) {
                this.currentImageIndex += 1;
                this.currentImageIndex %= this.images.length;
            }
            
        }
        else {
            this.currentImageIndex = 0;
        }
    }
}

export default Player;