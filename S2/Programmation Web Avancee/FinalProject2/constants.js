"use strict";
/*jshint -W117,-W098*/
class Constants {
    static get max_vertical_speed() {
        return 0.5;
    }

    static get gravity() {
        return new Vector(0, 0.001);
    }

    static get max_vertical_speed_v() {
        return new Vector(0, Constants.max_vertical_speed);
    }

    static get max_speed() {
        return new Vector(0.060, Constants.max_vertical_speed);
    }

    static get max_boosted_speed() {
        return new Vector(0.120, Constants.max_vertical_speed);
    }

    static get acceleration() {
        return Constants.gravity.add(new Vector(0.006,0));
    }

    static get boosted_acceleration() {
        return Constants.gravity.add(new Vector(0.012,0));
    }

    static get jump_acceleration() {
        return new Vector(0, -0.02);
    }

    static get min_speed() {
        return new Vector(0.01,0.01);
    }

    static get deceleration() {
        return new Vector(0.993698, 1);
    }
}