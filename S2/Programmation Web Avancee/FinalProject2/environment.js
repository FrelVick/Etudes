"use strict";
/*jshint -W117,-W098,-W016*/
class Background {
    constructor(img, ctx) {
        this.img = img;
        this.ctx = ctx;
        this.offset = 0;
        this.draw(0);
    }

    draw(back_move) {
        //if offset bigger then width - offset = 0
        this.offset = this.offset + back_move >= this.ctx.canvas.width ? 0 : this.offset + back_move;
        let i = 0;
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        while (-this.offset + i * this.img.width < this.ctx.canvas.width) {
            this.ctx.drawImage(this.img, -this.offset + i * this.img.width, 0);
            i++;
        }

    }
}

class Backgroungs {
    constructor(imgs, canvases) {
        this.backgrounds = [];
        this.backgrounds = canvases.map((item, i) => {
            return new Background(imgs[i], document.getElementById(item).getContext("2d"));
        });
        this.back_offset = 0;
    }

    draw(delta_offset) {
        for (let i = 0; i < this.backgrounds.length; i++) {
            let back_move = (((this.back_offset + delta_offset) / (i + 1)) | 0) - ((this.back_offset / (i + 1)) | 0);
            if (back_move) {
                this.backgrounds[i].draw(back_move);
            }
        }
        this.back_offset += delta_offset;
    }
}

class Level {
    constructor(img, tiles) {
        this.img = img;
        this.ctx = document.getElementById("level").getContext("2d");
        this.tiles = tiles;
        this.draw(0, this.ctx.canvas.width);
    }

    draw(offset) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.tiles.forEach(item => item.draw(offset, this.ctx.canvas.width, this.img, this.ctx));
    }
}

class Tile {
    constructor(id, tile_column, usagex, usagey) {
        this.id = id;
        this.coordinates = {x: id % tile_column - 1, y: (id / tile_column) | 0}; //line and column in tile sheet
        this.usage = [];                            //coordinates of each appearance
        this.add_usage(usagex, usagey);
        this.tile_size = 16;

    }

    add_usage(x, y) {
        this.usage.push({x: x, y: y});
    }

    draw(offset, width, img, ctx) {

        this.usage.forEach(item => {
            if (((item.x + 1) * this.tile_size > offset) && (item.x * this.tile_size < offset + width + this.tile_size)) {
                ctx.drawImage(img, this.coordinates.x * this.tile_size, this.coordinates.y * this.tile_size,
                    this.tile_size, this.tile_size, item.x * this.tile_size - offset, item.y * this.tile_size,
                    this.tile_size, this.tile_size);
            }
        });
    }

}

class Character {
    constructor(img) {
        this.img = img;
        this.dom = document.getElementById("player");
        this.ctx = this.dom.getContext("2d");
        this.size = 32;
        this.frame_rate = 6;
        this.frame_counter = 0;
        this.frame = 0;
        this.inversed = false;
    }

    draw(position, state) {
        this.frame_counter += 1;
        //choose image to draw

        if (!(this.frame_counter % this.frame_rate)) {
            switch (state.status) {
                case 0:
                    this.frame = 0;
                    break;
                case 1:
                    this.frame = ((this.frame_counter / this.frame_rate) % 4);
                    break;
                case 2:
                    this.frame = ((this.frame_counter / this.frame_rate) % 4) + 14;
                    break;
                case 3:
                    this.frame = 5;
                    break;
                case 4:
                    this.frame = 6;
                    break;
            }
            this.frame_counter %= 1000;
        }

        this.prev_state = state;
        //отобразить
        if (state.to_left !== this.inversed) {
            if (this.inversed) {
                this.dom.style.transform = "scaleX(1)";
            } else {
                this.dom.style.transform = "scaleX(-1)";
            }
        }
        this.inversed = state.to_left;
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        if (this.inversed) {
            this.ctx.drawImage(this.img, this.frame * this.size + 9, state.type * this.size + 12, 15, 20, this.ctx.canvas.width - position.x - 16, position.y, 15, 20);
        } else {
            this.ctx.drawImage(this.img, this.frame * this.size + 9, state.type * this.size + 12, 15, 20, position.x, position.y, 15, 20);
        }
    }
}

class Environment {
    constructor(imgs_back, cnvs_back, tile_img, tiles, chr_img, level_width) {
        this.backgrounds = new Backgroungs(imgs_back, cnvs_back);
        this.level = new Level(tile_img, tiles);
        this.character = new Character(chr_img);
        this.offset = 0;
        this.width = document.getElementById("level").width; // ширина видимой части экрана
        this.level_width = level_width;

    }

    update(new_position, state) { //status - бег, прыжок, падение, одетый?.
        if ((new_position.x > (this.width / 4 | 0)) && (new_position.x < this.level_width - (this.width / 4 | 0))) { //если не скраю экрана
            if (new_position.x > this.offset + ((this.width * 3 / 4) | 0)) { //если правее правой границы
                this.backgrounds.draw(new_position.x - (this.width * 3 / 4 | 0) - this.offset);
                this.offset = new_position.x - ((this.width * 3 / 4) | 0);
                this.level.draw(this.offset);
            } else {
                if (new_position.x < this.offset + (this.width / 4 | 0)) { //если левее левой
                    this.backgrounds.draw(new_position.x - (this.width / 4 | 0) - this.offset);
                    this.offset = new_position.x - this.width / 4 | 0;
                    this.level.draw(this.offset);
                }
            }
        } else {
            if ((this.offset !== 0) && (this.offset !== this.level_width - this.width)) { //если уперлись в стену, но оффсет не уперся в стену
                let old_offset = this.offset;
                this.offset = new_position.x <= (this.width / 4 | 0) ? 0 : this.level_width - this.width;
                this.level.draw(this.offset);
                this.backgrounds.draw(this.offset - old_offset);
            }
        }
        this.character.draw(new_position.sub(new Vector(this.offset, 0)), state);

    }
}
