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

    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    mult(k) {
        return new Vector(this.x * k, this.y * k);
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