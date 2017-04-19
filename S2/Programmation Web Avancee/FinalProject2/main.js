"use strict";
/*jshint -W117,-W098,-W016*/
let renderer;

let phase2 = function (renderer) {

    let interval;
    interval = setInterval(function () {
        try {
            renderer.update(1000 / 60);
        } catch (e) {
            clearInterval(interval);
            throw (e);
        }
    }, 1000 / 60);

    let second_interval = setInterval(function () {
        try {
            renderer.update_fps();
        } catch (e) {
            clearInterval(second_interval);
            throw (e);
        }
    }, 1000 / 60);

    document.onkeydown = function (eventObject) {
        let e = window.event || eventObject, k = e.keyCode;
        switch (k) {
            case 37:
                renderer.engine.key_pressed.left = true;
                break;
            case 39:
                renderer.engine.key_pressed.right = true;
                break;
            case 38:
                renderer.engine.key_pressed.up = true;
                break;
            case 16:
                renderer.engine.key_pressed.boost = true;
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
                renderer.engine.key_pressed.left = false;
                break;
            case 39:
                renderer.engine.key_pressed.right = false;
                break;
            case 38:
                renderer.engine.key_pressed.up = false;
                break;
            case 16:
                renderer.engine.key_pressed.boost = false;
                break;
        }
    };
};

let phase1 = function (level1_description) {
    let eng;
    let env;

    //let renderer;

    let init = new Init();
    let canvases = document.getElementsByClassName("canvas");
    if (window.innerWidth / 272 >
        window.innerHeight / 160) {
        for (let i = 0; i < canvases.length; i++) {
            canvases[i].style.height = "100%";
        }
    } else {
        for (let i = 0; i < canvases.length; i++) {
            canvases[i].style.width = "100%";
        }
    }
    init.imgs_back = [new Image(), new Image(), new Image(), new Image()];
    init.imgs_back[3].src = "img/skill-desc_0003_bg.png";
    init.imgs_back[2].src = "img/skill-desc_0002_far-buildings.png";
    init.imgs_back[1].src = "img/skill-desc_0001_buildings.png";
    init.imgs_back[0].src = "img/skill-desc_0000_foreground.png";
    init.cnvs_back = ["back4", "back3", "back2", "back1"];
    init.tile_img = new Image();

    init.tile_img.src = level1_description.image;

    level1_description.data.forEach((item, position) => {
        if (item) {
            let index = init.tiles.findIndex(tile => {
                return tile.id === item;
            });
            if (index >= 0) {
                init.tiles[index].add_usage((position % level1_description.width),
                    ((position / level1_description.width) | 0));
            } else {
                init.tiles.push(new Tile(item, level1_description.columns,
                    position % level1_description.width,
                    (position / level1_description.width) | 0));
            }
        }
    });

    init.chr_img = new Image();
    init.chr_img.src = "img/characters.png";

    eng = new Engine();
    init.tiles.forEach(item => {
        if (typeof level1_description.tileproperties[item.id - 1] !== "undefined") {
            let obstacle = level1_description.tileproperties[item.id - 1].obstacle === true;
            let death = level1_description.tileproperties[item.id - 1].death === true;
            let target = level1_description.tileproperties[item.id - 1].target === true;

            item.usage.forEach(item => {
                eng.addBody(new Obstacle(new Vector(item.x * level1_description.tilewidth, item.y * level1_description.tileheight),
                    level1_description.tilewidth, level1_description.tileheight, obstacle, death, target));

            });
        }
    });

    //adding invisible wall
    for (let i = 0; i <= level1_description.height; i++) {
        eng.addBody(new Obstacle(new Vector(-level1_description.tilewidth, - 1 + i * level1_description.tileheight),
            level1_description.tilewidth, level1_description.tileheight, true, false, false));
        eng.addBody(new Obstacle(new Vector(level1_description.tilewidth*level1_description.width, - 1 + i * level1_description.tileheight),
            level1_description.tilewidth, level1_description.tileheight, true, false, false));
    }

    let x = new Body(new Vector(0, 50), 15, 20, true,
        new Vector(-level1_description.tilewidth - 1, -level1_description.tileheight - 1),
        new Vector(level1_description.tilewidth + 16, level1_description.tileheight + 16));
    eng.addBody(x);

    env = new Environment(init.imgs_back, init.cnvs_back, init.tile_img, init.tiles, init.chr_img,
        level1_description.tilewidth * level1_description.width);

    renderer = new Renderer(eng, env);
    phase2(renderer);
};

let phase0 = function () {
    let to_preload = [];
    let x;

    let checkImage = path =>
        new Promise(resolve => {
            let img = new Image();
            img.onload = () => resolve({path, status: 'ok'});
            img.onerror = () => resolve({path, status: 'error'});

            img.src = path;
        });

    let loadImg = (paths) => Promise.all(paths.map(checkImage));

    let level1_description = JSON.parse('{"height":10,"width":32,"data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,409,404,404,404,404,404,404,404,404,404,404,404,404,406,409,404,404,404,404,404,404,404,404,404,404,404,406,342,325,343,0,0,405,0,0,0,0,0,6,8,0,0,0,0,0,408,407,0,0,0,0,426,428,0,0,0,0,0,408,404,306,331,0,404,407,0,0,312,312,312,312,312,312,312,312,0,0,0,0,0,732,732,0,0,0,0,732,732,0,0,0,341,841,344,0,0,0,0,0,335,28,26,26,26,26,27,221,0,0,0,0,0,335,448,0,352,353,0,447,641,0,0,0,0,0,0,755,87,219,219,219,333,118,772,348,348,773,119,334,219,219,219,219,219,333,538,352,0,0,353,539,754,639,639,639,639,639,639,753,0,0,0,0,0,120,775,350,350,774,121,0,0,0,0,0,0,0,120,775,350,350,774,121,0,0,0,0,0,0,0,0],"tileheight":16,"tilewidth":16,"image":"img/bofhblkalpha.png","columns":20,"tileproperties":{"5":{"obstacle":true},"7":{"obstacle":true},"24":{"obstacle":true},"25":{"obstacle":true},"26":{"obstacle":true},"27":{"obstacle":true},"86":{"obstacle":true},"218":{"obstacle":true},"220":{"obstacle":true},"334":{"obstacle":true},"351":{"death":true},"352":{"death":true},"425":{"obstacle":true},"427":{"obstacle":true},"446":{"obstacle":true},"447":{"obstacle":true},"638":{"obstacle":true},"640":{"obstacle":true},"754":{"obstacle":true},"840":{"target":true}}}');


    to_preload.push(level1_description.image);
    to_preload.push("img/skill-desc_0003_bg.png");
    to_preload.push("img/skill-desc_0002_far-buildings.png");
    to_preload.push("img/skill-desc_0001_buildings.png");
    to_preload.push("img/skill-desc_0000_foreground.png");
    to_preload.push("img/characters.png");
    x = loadImg(to_preload);
    x.then(() => phase1(level1_description));
};

window.addEventListener("load", phase0());