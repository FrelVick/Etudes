/**
 * Created by Виктор on 06.04.2017.
 */
"use strict";
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    add_wo_overflow(v, b) {
        return new Vector(Math.abs(this.x + v.x) > b.x ? Math.sign(this.x + v.x) * b.x : this.x + v.x,
            Math.abs(this.y + v.y) > b.y ? Math.sign(this.y + v.y) * b.y : this.y + v.y)
    }

    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    mult(k) {
        return new Vector(this.x * k, this.y * k);
    }

    pow(k) {
        return new Vector(Math.pow(this.x, k), Math.pow(this.y, k))
    }

    mult_v(v) {
        return new Vector(this.x * v.x, this.y * v.y)
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    norm() {
        return Math.sqrt(this.dot(this));
    }

    normalize() {
        return this.mult(1 / this.norm());
    }

    axe_not_moved() {
        return new Vector(this.x == 0 | 0, this.y == 0 | 0)
    }

    invert_x() {
        return new Vector(-this.x,this.y);
    }

    static get ZERO() {
        return new Vector(0, 0);
    }

    static get UNIT_X() {
        return new Vector(1, 0);
    }

    static get UNIT_Y() {
        return new Vector(0, 1);
    }

    static get MINUS_UNIT_X() {
        return new Vector(-1, 0);
    }

    static get MINUS_UNIT_Y() {
        return new Vector(0, -1);
    }
}