"use strict";
/*jshint -W117,-W098,-W016*/
class Renderer {
    constructor(e, env) {
        this.engine = e;
        this.env = env;
        this.offset = 0;
        this.filter_strenght = 10;
        this.element = document.getElementById("fps");
        this.frame_time = 0;
        this.last_loop = new Date();
        this.this_loop = new Date();
    }

    update(dt) {
        this.engine.update(dt);
        this.env.update(this.engine.dynamic_bodies[0].origin, this.engine.dynamic_bodies[0].state);
        this.frame_time += (((this.this_loop = new Date())-this.last_loop)-this.frame_time)/this.filter_strenght;
        this.last_loop = this.this_loop;
    }

    update_fps(){
        this.element.innerHTML = ((1000/this.frame_time) | 0) + " fps";
    }
}

class CharacterState {
    constructor() {
        this.status = 0;
        this.movement = 0;
        this.type = 0;
        this.to_left = false;
        this.on_floor = false;
        this.double_jump = false;
    }

    set status(s) {
        switch (s) {
            case "wait":
                this.movement = 0;
                break;
            case "walk":
                this.movement = 1;
                break;
            case "run":
                this.movement = 2;
                break;
            case "jump_up":
                this.movement = 3;
                break;
            case "jump_down":
                this.movement = 4;
                break;
        }
    }

    get status() {
        return this.movement;
    }
}
