/**
 * Created by wtflocal on 12.03.2017.
 */
"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */ /*global define */
function movebackground(dx, ctx) {
    let modulo = Math.abs(dx);
    let staticpart = ctx.getImageData((modulo - dx) >> 1, 0, ctx.canvas.width - modulo, ctx.canvas.height); // jshint ignore:line
    console.log("static copy", (modulo - dx) >> 1, 0, ctx.canvas.width - modulo, ctx.canvas.height); // jshint ignore:line
    let dynamicpart = ctx.getImageData((ctx.canvas.width / modulo - 1) * ((modulo + dx) >> 1), 0, modulo, ctx.canvas.height); // jshint ignore:line
    console.log("dynamic copy", (ctx.canvas.width / modulo - 1) * ((modulo + dx) >> 1), 0, (ctx.canvas.width / modulo - 1) * ((modulo + dx) >> 1) + modulo, ctx.canvas.height); // jshint ignore:line // jshint ignore:line
    ctx.putImageData(staticpart, ((modulo + dx) >> 1), 0); // jshint ignore:line
    console.log("static past", ((modulo + dx) >> 1), 0); // jshint ignore:line
    ctx.putImageData(dynamicpart, (ctx.canvas.width / modulo - 1) * ((modulo - dx) >> 1), 0); // jshint ignore:line
    console.log("dynamic past", (ctx.canvas.width / modulo - 1) * ((modulo - dx) >> 1), 0); // jshint ignore:line
}

function movebackgrounds(ctxs, dx) {
    let delta = 1 * dx;
    for (let [index, ctx] of ctxs.entries()) {
        console.log(delta, ctx);
        movebackground(delta, ctx);
        delta *= index + 1;
    }
}

function drawbackgrounds(backgrounds) {
    let gamearea = document.getElementById("GameArea");
    let ctx = [];
    for (let [index, path] of backgrounds.entries()) {
        gamearea.innerHTML += '<canvas class="canvas" id="background' + index + '" width="272" height="160"></canvas>';
        /*let htmlelem = document.getElementById("background"+index);
         ctx[index] = htmlelem.getContext("2d");
         imgs[index] = new Image();
         imgs[index].ctx = ctx[index];
         imgs[index].id = index;
         imgs[index].src = path;
         imgs[index].onload = function () {
         //ctx[this.id].drawImage(this,0,0);
         console.log(this.id);
         console.log(ctx);
         console.log(this);
         };
         console.log(imgs[index].onload);
         //console.log(index,img);*/

    }

    /*  Костыль  */

    let Background0 = document.getElementById("background0");
    ctx[0] = Background0.getContext("2d");
    let img = new Image();
    img.src = "img/skill-desc_0003_bg.png";
    img.ctx = ctx[0];
    img.onload = function () {
        this.ctx.drawImage(this, 0, 0);
    };

    Background0 = document.getElementById("background1");
    ctx[1] = Background0.getContext("2d");
    let Img1 = new Image();
    Img1.src = "img/skill-desc_0002_far-buildings.png";
    Img1.ctx = ctx[1];
    Img1.onload = function () {
        this.ctx.drawImage(this, 0, 0);
    };

    Background0 = document.getElementById("background2");
    ctx[2] = Background0.getContext("2d");
    let Img2 = new Image();
    Img2.src = "img/skill-desc_0001_buildings.png";
    Img2.ctx = ctx[2];
    Img2.onload = function () {
        this.ctx.drawImage(this, 0, 0);
    };

    Background0 = document.getElementById("background3");
    ctx[3] = Background0.getContext("2d");
    let Img3 = new Image();
    Img3.src = "img/skill-desc_0000_foreground.png";
    Img3.ctx = ctx[3];
    Img3.onload = function () {
        this.ctx.drawImage(this, 0, 0);
    };
    return ctx;
}