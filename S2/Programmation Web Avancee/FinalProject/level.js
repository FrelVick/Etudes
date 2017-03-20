/**
 * Created by Виктор on 19.03.2017.
 */
"use strict";
class level {
    constructor(level, width, height) {
        this.level = level;
        this.width = width;
        this.height = height;
    }

    validate() {
        return this.level.length === this.width * this.height;
    }

    getblock(x, y) {
        if ((x > this.width-1) || (y > this.height-1)) {
            return 0;
        }
        return this.level[y * this.width + x];
    }
}