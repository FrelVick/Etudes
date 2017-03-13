/**
 * Created by wtflocal on 11.03.2017.
 */
"use strict";
let init = function () {
    // loading of obstacles

    let s = '[[{"tileid":0,"obstacle":true,"fixed":true, "lethal":false}, {"tileid":1,"obstacle":false,"fixed":true, "lethal":false}, {"tileid":2,"obstacle":false,"fixed":true, "lethal":true}],"1112311123","tilesheet.png",["img/skill-desc_0003_bg.png","img/skill-desc_0002_far-buildings.png","img/skill-desc_0001_buildings.png","img/skill-desc_0000_foreground.png"]]';
    let [tiles, map, tilesheet, backgrounds] = parse(s);

    // TODO Drawing backgrounds


    /*let imgs = [];*/
    let backgroundcontexts = drawbackgrounds(backgrounds);
    document.onkeydown = function (eventObject) {
        let e = window.event || eventObject, K = e.keyCode;
        if (K === 37) {
            movebackgrounds(backgroundcontexts, -1);
        }
        else if (K === 39) {
            movebackgrounds(backgroundcontexts, 1);
        }
    };


    // TODO drawing obstacles
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

};

window.addEventListener("load", init);