/**
 * Created by wtflocal on 12.03.2017.
 */
"use strict";
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */ /*global define */
function movebackground(dx, ctx) {
    let modulo = Math.abs(dx);
    let staticpart = ctx.getImageData((modulo - dx) >> 1, 0, ctx.canvas.width - modulo, ctx.canvas.height); // jshint ignore:line
    //console.log("static copy", (modulo - dx) >> 1, 0, ctx.canvas.width - modulo, ctx.canvas.height); // jshint ignore:line
    let dynamicpart = ctx.getImageData((ctx.canvas.width / modulo - 1) * ((modulo + dx) >> 1), 0, modulo, ctx.canvas.height); // jshint ignore:line
    //console.log("dynamic copy", (ctx.canvas.width / modulo - 1) * ((modulo + dx) >> 1), 0, (ctx.canvas.width / modulo - 1) * ((modulo + dx) >> 1) + modulo, ctx.canvas.height); // jshint ignore:line // jshint ignore:line
    ctx.putImageData(staticpart, ((modulo + dx) >> 1), 0); // jshint ignore:line
    //console.log("static past", ((modulo + dx) >> 1), 0); // jshint ignore:line
    ctx.putImageData(dynamicpart, (ctx.canvas.width / modulo - 1) * ((modulo - dx) >> 1), 0); // jshint ignore:line
    //console.log("dynamic past", (ctx.canvas.width / modulo - 1) * ((modulo - dx) >> 1), 0); // jshint ignore:line
}

function movebackgrounds(ctxs, dx) {
    let delta = 1 * dx;
    for (let [index, ctx] of ctxs.entries()) {
        //console.log(delta, ctx);
        movebackground(delta, ctx);
        delta *= index + 1;
    }
}

function drawbackgrounds(backgrounds) {
    let gamearea = document.getElementById("GameArea");
    let ctx = [];
    let imgs = [];

    for (let [index, path] of backgrounds.entries()) {
        let htmlelem = document.createElement("canvas");
        htmlelem.id = 'background' + index;
        htmlelem.className = "canvas";
        htmlelem.width = 272;
        htmlelem.height = 160;
        gamearea.appendChild(htmlelem);
        ctx[index] = htmlelem.getContext("2d");
        imgs[index] = new Image();
        imgs[index].ctx = ctx[index];
        imgs[index].id = index;
        imgs[index].src = path;
        imgs[index].onload = function () {
            //console.log();
            ctx[this.id].drawImage(this, 0, 0);
            //console.log(this.id+"");
            //console.log(ctx[this.id]);
            //console.log(this);
        };

    }

    return ctx;
}