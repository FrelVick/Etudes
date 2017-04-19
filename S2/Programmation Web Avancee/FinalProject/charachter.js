/**
 * Created by Виктор on 20.03.2017.
 */
"use strict";
class charachter {
    constructor(img, size, ctx, x, y) {
        this.img = new Image();
        this.img.src = img;
        this.size = size;
        this.ctx = ctx;
        this.img.onload = function () {
            //drawman();
        };
        this.x = x;
        this.y = y;
        this.type = 0;
        this.frame = 0;
        this.inair = false;
        this.xspeed = 0;
        this.ximpulse = 0;
        this.xmaxspeed = 0;
    }

    redrawcharacter() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.drawImage(this.img, this.frame * this.size, this.type * this.size, this.size, this.size, this.x, this.y, this.size, this.size);
    }



}