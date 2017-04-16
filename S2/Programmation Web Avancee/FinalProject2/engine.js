"use strict";
/*jshint -W117,-W098*/

class Engine {
    constructor() {
        this.static_bodies = [];
        this.dynamic_bodies = [];
        this.key_pressed = {left: false, up: false, right: false, boost: false};
    }

    addBody(b) {
        if (b.movable) {
            this.dynamic_bodies.push(b);
        } else {
            this.static_bodies.push(b);
        }
    }

    update(dt) {

        this.dynamic_bodies.forEach(function (item, curr, dynamic_bodies) {
            let top_left_interaction = item.origin.add(item.interaction_left_top);
            let right_down_interaction = item.origin.add(item.interaction_right_down);
            dynamic_bodies[curr].state.status = "wait";
            // 1. recalculating of acceleration
            if (this.key_pressed.left !== this.key_pressed.right) {
                dynamic_bodies[curr].state.to_left = false;
                if (this.key_pressed.boost) {
                    dynamic_bodies[curr].maxspeed = Constants.max_boosted_speed;
                    dynamic_bodies[curr].acceleration = Constants.boosted_acceleration;
                } else {
                    dynamic_bodies[curr].maxspeed = Constants.max_speed;
                    dynamic_bodies[curr].acceleration = Constants.acceleration;
                }
                if (this.key_pressed.left) {
                    dynamic_bodies[curr].state.to_left = true;
                    dynamic_bodies[curr].acceleration = dynamic_bodies[curr].acceleration.invert_x();
                }
            } else {
                item.maxspeed = Constants.max_vertical_speed_v;
                dynamic_bodies[curr].acceleration = Constants.gravity;
            }


            // 1.1 adding y
            if (this.key_pressed.up) {
                this.key_pressed.up = false;
                if (dynamic_bodies[curr].state.on_floor) {
                    dynamic_bodies[curr].acceleration = dynamic_bodies[curr].acceleration.add(Constants.jump_acceleration);
                    dynamic_bodies[curr].state.double_jump = false;
                }
                else {
                    if (!(dynamic_bodies[curr].state.double_jump)) {
                        dynamic_bodies[curr].state.double_jump = true;
                        //add little acceleration
                        dynamic_bodies[curr].acceleration = dynamic_bodies[curr].acceleration.add(Constants.jump_acceleration.mult(1 - Math.abs(dynamic_bodies[curr].velocity.y) * 1.4));
                        dynamic_bodies[curr].velocity = dynamic_bodies[curr].velocity.mult_v(Vector.UNIT_X);

                    }
                }

            }
            // 2. recalculating of speed

            dynamic_bodies[curr].velocity = dynamic_bodies[curr].velocity.add_wo_overflow(
                dynamic_bodies[curr].acceleration.mult(dt), dynamic_bodies[curr].maxspeed);
            dynamic_bodies[curr].acceleration = Vector.ZERO;

            // 3. deceleration

            dynamic_bodies[curr].velocity = Math.abs(dynamic_bodies[curr].velocity.x) > dynamic_bodies[curr].maxspeed.x ?
                dynamic_bodies[curr].velocity.mult_v(Constants.deceleration.pow(dt)) :
                dynamic_bodies[curr].velocity;

            dynamic_bodies[curr].velocity = Math.abs(item.velocity.y) < Constants.min_speed.y ?
                dynamic_bodies[curr].velocity.mult_v(Vector.UNIT_X) : dynamic_bodies[curr].velocity;

            // 4. recalculating of position

            dynamic_bodies[curr].move(dynamic_bodies[curr].velocity.mult(dt));

            // 5. collision
            dynamic_bodies[curr].state.on_floor = false;
            for (let j = 0; j < this.static_bodies.length; j++) {
                if (this.static_bodies[j].origin.x > top_left_interaction.x &&
                    this.static_bodies[j].origin.y > top_left_interaction.y &&
                    this.static_bodies[j].origin.x < right_down_interaction.x &&
                    this.static_bodies[j].origin.y < right_down_interaction.y) {
                    let res = item.collision(this.static_bodies[j]);

                    if (res !== null) {
                        if (this.static_bodies[j].obstacle) {
                            if (res.y < 0) {
                                dynamic_bodies[curr].state.on_floor = true;
                                dynamic_bodies[curr].state.double_jump = true;
                            }
                            res = res.axe_not_moved();
                            dynamic_bodies[curr].velocity = dynamic_bodies[curr].velocity.mult_v(res);
                            dynamic_bodies[curr].acceleration = dynamic_bodies[curr].acceleration.mult_v(res);
                        } else {
                            if (this.static_bodies[j].death) {
                                this.dynamic_bodies.push(new Body(new Vector(0, 50),
                                    this.dynamic_bodies[0].width, this.dynamic_bodies[0].height,
                                    true, this.dynamic_bodies[0].interaction_left_top, this.dynamic_bodies[0].interaction_right_down));
                                this.dynamic_bodies[1].state = this.dynamic_bodies[0].state;

                                this.dynamic_bodies.splice(0, 1);

                            } else {
                                if (this.static_bodies[j].target) {
                                    this.static_bodies.splice(j, 1);
                                    dynamic_bodies[curr].state.type += 1;
                                }
                            }
                        }
                    }
                }
            }

            // 6. update character status


            if (item.velocity.y > 0) {
                dynamic_bodies[curr].state.status = "jump_up";
            } else {
                if (item.velocity.y < 0) {
                    dynamic_bodies[curr].state.status = "jump_down";
                } else {
                    if (item.velocity.x !== 0) {
                        if (item.maxspeed === Constants.max_boosted_speed) {
                            dynamic_bodies[curr].state.status = "run";
                        } else {
                            dynamic_bodies[curr].state.status = "walk";
                        }
                    }
                }
            }

        }, this);
    }
}