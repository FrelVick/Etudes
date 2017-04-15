/**
 * Created by Виктор on 07.04.2017.
 */
"use strict";
let test;
let eng;
let env;

let renderer;

let init = new Init();

let to_preload = [];
let x;

let phase0 = function () {
    let checkImage = path =>
        new Promise(resolve => {
            let img = new Image();
            img.onload = () => resolve({path, status: 'ok'});
            img.onerror = () => resolve({path, status: 'error'});

            img.src = path;
        });

    let loadImg = (paths) => Promise.all(paths.map(checkImage));

    let level1_description = JSON.parse('{"height":10,"layers":[{"data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,409,404,404,404,404,404,404,404,404,404,404,404,404,406,409,404,404,404,404,404,404,404,404,404,404,404,406,342,325,343,0,0,405,0,0,0,0,0,6,8,0,0,0,0,0,408,407,0,0,0,0,426,428,0,0,0,0,0,408,404,306,331,0,404,407,0,0,312,312,312,312,312,312,312,312,0,0,0,0,0,732,732,0,0,0,0,732,732,0,0,0,341,841,344,0,0,0,0,0,335,28,26,26,26,26,27,221,0,0,0,0,0,335,448,0,352,353,0,447,641,0,0,0,0,0,0,755,87,219,219,219,333,118,772,348,348,773,119,334,219,219,219,219,219,333,538,352,0,0,353,539,754,639,639,639,639,639,639,753,0,0,0,0,0,120,775,350,350,774,121,0,0,0,0,0,0,0,120,775,350,350,774,121,0,0,0,0,0,0,0,0],"height":10,"name":"level","opacity":1,"type":"tilelayer","visible":true,"width":32,"x":0,"y":0}],"nextobjectid":1,"orientation":"orthogonal","renderorder":"left-up","tileheight":16,"tilesets":[{"columns":20,"firstgid":1,"image":"img/bofhblkalpha.png","imageheight":800,"imagewidth":320,"margin":0,"name":"bofhblkalpha","spacing":0,"tilecount":1000,"tileheight":16,"tileproperties":{"5":{"obstacle":true},"7":{"obstacle":true},"24":{"obstacle":true},"25":{"obstacle":true},"26":{"obstacle":true},"27":{"obstacle":true},"86":{"obstacle":true},"218":{"obstacle":true},"220":{"obstacle":true},"334":{"obstacle":true},"351":{"death":true},"352":{"death":true},"425":{"obstacle":true},"427":{"obstacle":true},"446":{"obstacle":true},"447":{"obstacle":true},"638":{"obstacle":true},"640":{"obstacle":true},"754":{"obstacle":true},"840":{"target":true}},"tilepropertytypes":{"5":{"obstacle":"bool"},"7":{"obstacle":"bool"},"24":{"obstacle":"bool"},"25":{"obstacle":"bool"},"26":{"obstacle":"bool"},"27":{"obstacle":"bool"},"86":{"obstacle":"bool"},"218":{"obstacle":"bool"},"220":{"obstacle":"bool"},"334":{"obstacle":"bool"},"351":{"death":"bool"},"352":{"death":"bool"},"425":{"obstacle":"bool"},"427":{"obstacle":"bool"},"446":{"obstacle":"bool"},"447":{"obstacle":"bool"},"638":{"obstacle":"bool"},"640":{"obstacle":"bool"},"754":{"obstacle":"bool"},"840":{"target":"bool"}},"tilewidth":16}],"tilewidth":16,"version":1,"width":32}');


    to_preload.push(level1_description.tilesets[0].image);
    to_preload.push("img/skill-desc_0003_bg.png");
    to_preload.push("img/skill-desc_0002_far-buildings.png");
    to_preload.push("img/skill-desc_0001_buildings.png");
    to_preload.push("img/skill-desc_0001_buildings.png");
    to_preload.push("img/characters.png");
    x = loadImg(to_preload);
    x.then(res => phase1(level1_description));
};

let phase1 = function (level1_description) {
    let canvases = document.getElementsByClassName("canvas");
    if (window.innerWidth / 272 >
        window.innerHeight / 160) {
        for (let i = 0; i < canvases.length; i++) {
            canvases[i].style.height = "100%"
        }
    } else {
        for (let i = 0; i < canvases.length; i++) {
            canvases[i].style.width = "100%"
        }
    }
    init.imgs_back = [new Image(), new Image(), new Image(), new Image()];
    init.imgs_back[3].src = "img/skill-desc_0003_bg.png";
    init.imgs_back[2].src = "img/skill-desc_0002_far-buildings.png";
    init.imgs_back[1].src = "img/skill-desc_0001_buildings.png";
    init.imgs_back[0].src = "img/skill-desc_0000_foreground.png";
    init.cnvs_back = ["back4", "back3", "back2", "back1"];
    init.tile_img = new Image();

    init.tile_img.src = level1_description.tilesets[0].image;

    level1_description.layers[0].data.forEach((item, position) => {
        if (item) {
            let index = init.tiles.findIndex(tile => {
                return tile.id === item;
            });
            if (index >= 0) {
                init.tiles[index].add_usage((position % level1_description.width),
                    ((position / level1_description.layers[0].width) | 0));
            } else {
                init.tiles.push(new Tile(item, level1_description.tilesets[0].columns,
                    position % level1_description.width,
                    (position / level1_description.layers[0].width) | 0));
            }
        }
    });

    init.chr_img = new Image();
    init.chr_img.src = "img/characters.png";

    eng = new Engine();
    init.tiles.forEach(item => {
        if (typeof level1_description.tilesets[0].tileproperties[item.id - 1] !== "undefined") {
            let obstacle = level1_description.tilesets[0].tileproperties[item.id - 1].obstacle === true;
            let death = level1_description.tilesets[0].tileproperties[item.id - 1].death === true;
            let target = level1_description.tilesets[0].tileproperties[item.id - 1].target === true;

            item.usage.forEach(item => {
                eng.addBody(new Obstacle(new Vector(item.x * level1_description.tilewidth, item.y * level1_description.tileheight),
                    level1_description.tilewidth, level1_description.tileheight, obstacle, death, target));

            })
        }
    });
    let x = new Body(new Vector(0, 50), 15, 20, true,
        new Vector(-level1_description.tilewidth, -level1_description.tileheight),
        new Vector(level1_description.tilewidth + 16, level1_description.tileheight + 16));
    eng.addBody(x);
    //phase2(eng);
    let down_board = new Body(new Vector(0, 160), 600, 100);
    eng.addBody(down_board);

    env = new Environment(init.imgs_back, init.cnvs_back, init.tile_img, init.tiles, init.chr_img);
    phase3(" ");
};

let phase2 = function (engine) {

};

let phase3 = function (string) {
    renderer = new Renderer(eng, env);

    let interval;
    interval = setInterval(function () {
        try {
            renderer.update(1000 / 60);
        } catch (e) {
            clearInterval(interval);
            throw (e);
        }
    }, 1000 / 60);

    document.onkeydown = function (eventObject) {
        let e = window.event || eventObject, k = e.keyCode;
        switch (k) {
            case 37:
                eng.key_pressed.left = true;
                break;
            case 39:
                eng.key_pressed.right = true;
                break;
            case 38:
                eng.key_pressed.up = true;
                break;
            case 16:
                eng.key_pressed.boost = true;
                break;
            case 27:
                clearInterval(interval);
                break;
        }
    };

    document.onkeyup = function (eventObject) {
        let e = window.event || eventObject, k = e.keyCode;
        switch (k) {
            case 37:
                eng.key_pressed.left = false;
                break;
            case 39:
                eng.key_pressed.right = false;
                break;
            case 38:
                eng.key_pressed.up = false;
                break;
            case 16:
                eng.key_pressed.boost = false;
                break;
        }
    };
};

//document.onload = phase0();
window.addEventListener("DOMContentLoaded", phase0(), false);

//end test