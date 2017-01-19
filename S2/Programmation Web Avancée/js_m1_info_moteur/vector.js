var Vector = function (x,y) {
  
  Object.defineProperty(this, "x", {value : x, writable : false});
  Object.defineProperty(this, "y", {value : y, writable : false});
  
  
};

Vector.prototype.add = function (v) {
  return new Vector(this.x + v.x, this.y + v.y);
};

Vector.prototype.sub = function (v) {
  return new Vector(this.x - v.x, this.y - v.y);
};

Vector.prototype.mult = function (k) {
  return new Vector(this.x * k, this.y * k);
};

Vector.prototype.dot = function (v) {
  return this.x * v.x + this.y * v.y;
};

Vector.prototype.norm = function () {
  return Math.sqrt(this.dot(this));
};

Vector.prototype.normalize = function () {
  return this.mult( 1/this.norm() );
};

Object.defineProperty(Vector, "ZERO", {value : new Vector(0,0), writable : false});

