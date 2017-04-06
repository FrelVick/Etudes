/**
 * Created by wtflocal on 11.03.2017.
 */
"use strict";
let game;
let init = function () {
    // loading of obstacles

    let s = '[[{"tileid":860,"obstacle":false,"fixed":false, "lethal":false}, {"tileid":5,"obstacle":false,"fixed":true, "lethal":false}, {"tileid":6,"obstacle":false,"fixed":true, "lethal":true},{"tileid":7,"obstacle":false,"fixed":true, "lethal":true},{"tileid":27,"obstacle":true,"fixed":true, "lethal":false},{"tileid":24,"obstacle":true,"fixed":true, "lethal":false},{"tileid":26,"obstacle":true,"fixed":true, "lethal":false},{"tileid":225,"obstacle":true,"fixed":true, "lethal":false},{"tileid":226,"obstacle":true,"fixed":true, "lethal":false}],' +
        '[[860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,' +
        '860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,' +
        '860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,' +
        '860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,' +
        '860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,' +
        '860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,' +
        '860,860,860,860,860,860,225,226,225,226,225,226,225,860,860,860,860,' +
        '860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,' +
        '860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,860,' +
        '5,6,6,6,6,6,7,27,24,24,24,26,5,6,6,6,7]' +
        ',17,10],' +
        '["img/bofhblkalpha.png",16],' +
        '["img/skill-desc_0003_bg.png","img/skill-desc_0002_far-buildings.png","img/skill-desc_0001_buildings.png","img/skill-desc_0000_foreground.png"]]';
    let [tiles, map, tilesheet, backgrounds] = parse(s);
    console.log(tiles, map);

    // TODO Drawing backgrounds


    /*let imgs = [];*/
    let backgroundcontexts = drawbackgrounds(backgrounds);


    // TODO drawing obstacles
    //console.log(map.validate());

    /* создание нового канваса*/
    let gamearea = document.getElementById("GameArea");
    let htmlelem = document.createElement("canvas");
    htmlelem.id = 'obstacles';
    htmlelem.className = "canvas";
    htmlelem.width = 272;
    htmlelem.height = 160;
    gamearea.appendChild(htmlelem);

    /* рисование элементов?  */
    let tileimg = new tileimgs(tilesheet[0], tilesheet[1]);

    game = function () {
        var [img, dx, dy, sizex, sizey] = tileimg.gettile(2);
        let ctx = htmlelem.getContext("2d");
        console.log(map.level);
        for (var i = 0; i < map.width; i++) {
            for (var j = 0; j < map.height; j++) {
                [img, dx, dy, sizex, sizey] = tileimg.gettile(tiles[map.level[j * map.width + i]].tileid);
                console.log(img, dx, dy, sizex, sizey, i, j, map.level[j * map.width + i]);
                ctx.drawImage(img, dx, dy, sizex, sizey, i * tileimg.size, j * tileimg.size, tileimg.size, tileimg.size);
            }
        }
    }
    /*let background1 = document.getElementById("background1");
     let ctx1 = background0.getContext("2d");
     let img1 = new Image();
     img1.src = "img/exterior-parallaxBG2.png";
     ctx1.drawImage(img1,0,0);*/


    //console.log(tiles);
    //console.log(map);
    //console.log(tilesheet);
    //console.log(backgrounds);

    // TODO background movement
    document.onkeydown = function (eventObject) {
        let e = window.event || eventObject, K = e.keyCode;
        if (K === 37) {
            movebackgrounds(backgroundcontexts, -1);
        }
        else if (K === 39) {
            movebackgrounds(backgroundcontexts, 1);
        }
    };
};

window.addEventListener("load", init);