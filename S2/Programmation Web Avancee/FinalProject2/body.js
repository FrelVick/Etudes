"use strict";
/*jshint -W117,-W098*/

class Rect {
    constructor(v, w, h) {
        this.origin = v;
        this.width = w;
        this.height = h;
    }

    move(v) {
        this.origin = this.origin.add(v);
    }

    mDiff(r) {
        let orig = new Vector(r.origin.x - this.origin.x - this.width,
            r.origin.y - this.origin.y - this.height);
        return new Rect(orig, this.width + r.width, this.height + r.height);
    }

    hasOrigin() {
        return (this.origin.x < 0 && this.origin.x + this.width > 0) && (this.origin.y < 0 && this.origin.y + this.height > 0);
    }
}

class Body extends Rect {
    constructor(v, w, h, movable = false, interaction_left = 0, interaction_right = 0) {
        super(v, w, h);
        this.movable = movable;
        if (movable) {
            this.velocity = Vector.ZERO;
            this.acceleration = Vector.ZERO;
            this.maxspeed = Constants.max_vertical_speed_v;
            this.state = new CharacterState();
            this.interaction_left_top = interaction_left;
            this.interaction_right_down = interaction_right;
        }
    }

    collision(b) {
        if (!this.movable) {
            return null;
        }
        let mdiff = this.mDiff(b);
        if (mdiff.hasOrigin()) {
            let vectors = [new Vector(0, mdiff.origin.y),
                new Vector(0, mdiff.origin.y + mdiff.height),
                new Vector(mdiff.origin.x, 0),
                new Vector(mdiff.origin.x + mdiff.width, 0)];

            let n = vectors[0];

            for (let i = 1; i < vectors.length; i++) {
                if (vectors[i].norm() < n.norm()) {
                    n = vectors[i];
                }
            }

            this.move(n);

            return n;
        } else {
            return null;
        }

    }
}

class Obstacle extends Body {
    constructor(v, w, h, obstacle, death, target) {
        super(v, w, h);
        this.obstacle = obstacle;
        this.death = death;
        this.target = target;
    }
}

