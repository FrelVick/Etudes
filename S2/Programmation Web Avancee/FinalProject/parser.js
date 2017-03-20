/**
 * Created by wtflocal on 12.03.2017.
 */
"use strict";
function parse(s) {
    let tileinst;
    let parsed = [];
    let tiles = JSON.parse(s);
    let tileindexes = {};
    for (let i = 0; i < tiles[0].length; i++) { // TODO rewrite using http://exploringjs.com/es6/ch_core-features.html#sec_for-foreach-forof
        tileinst = new Tile();
        for (let property in tiles[0][i]) {
            if (tiles[0][i].hasOwnProperty(property)) {
                if (property === "tileid") {
                    tileindexes[tiles[0][i][property]] = i;
                }
                tileinst.append(property, tiles[0][i][property]);
            }
        }

        tiles[0][i] = tileinst;
        /*tiles[i] = tileinst.append(tiles[i].tileid, tiles[i].obstacle, tiles[i].fixed, tiles[i].lethal);
         for (let obj of tiles[i]) {
         console.log(obj);
         }*/

        //TODO add 0 element

    }


    parsed[0] = tiles[0];
    parsed[1] = new level(tiles[1][0].map((id) => {
            if (typeof tileindexes[id] === "undefined") {
                alert("Tiles and map incompability");
            }
            return tileindexes[id];
        }), tiles[1][1], tiles[1][2]
    )
    ;
    parsed[2] = tiles[2];
    parsed[3] = tiles[3];
    return parsed;
}