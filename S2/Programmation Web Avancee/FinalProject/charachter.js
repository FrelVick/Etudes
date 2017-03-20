/**
 * Created by Виктор on 20.03.2017.
 */
"use strict";
class charachter {
    constructor(img, size, ctx) {
        this.img = new Image();
        this.img.src = img;
        this.size = size;
        this.ctx = ctx;
        this.img.onload = function () {
            drawman();
        };
    }

    getcharacter(pers, frame) {
        return [this.img, pers * this.size, frame * this.size, this.size, this.size];
    }


}