/**
 * Created by Виктор on 19.03.2017.
 */
"use strict";
class tileimgs {
    constructor(img, size) {
        this.tilesheet = new Image();
        this.tilesheet.src = img;
        this.tilesheet.onload = function () {
            this.parenttileimgs.width = this.parenttileimgs.tilesheet.width;
            game(); //TODO ask about phases
        };
        this.size = size;
        this.tilesheet.parenttileimgs = this;
    }
    gettile(index) {
        if (typeof this.width === "undefined") {alert("не загрузилос");}
        return [this.tilesheet, index * this.size % this.width, (index / (this.width/ this.size) | 0) * this.size,
            this.size, this.size];
    }
}