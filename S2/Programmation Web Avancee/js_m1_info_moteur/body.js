var Body = function (v, w, h, m) {
  
  Rect.call(this, v, w, h);
  
  Object.defineProperty(this, "mass", {value : m, writable : false});
  Object.defineProperty(this, "invMass", {value : 1/m, writable : false});
  this.velocity = Vector.ZERO;
  this.force = Vector.ZERO;
  
};

Body.prototype = Object.create(Rect.prototype);
Body.prototype.constructor = Body;

Body.prototype.collision = function (b) {

  var s = this.mDiff (b);
  if (s.hasOrigin()) {
    var vectors = [
      new Vector (s.origin.x, 0),
      new Vector (s.origin.x + s.width, 0),
      new Vector (0, s.origin.y + s.height),
      new Vector (0, s.origin.y )
    ];
    var n = vectors[0];
    for (var i = 1; i < vectors.length; i++) {
      if (vectors[i].norm() < n.norm())
        n = vectors[i];
    };
    var vc = this.velocity;
    var vb = b.velocity;
    
    var nc = vc.norm() / (vc.norm() + vb.norm());
    var nb = vb.norm() / (vc.norm() + vb.norm());
    
    if (nc.norm() === 0 && vb.norm() === 0) {
      if (this.invMas === 0 && b.invMass === 0)
        return null;
      else {
        if (this.mass < b.mass) {
          nc = 1;
          nb = 0;
        } else {
          nc = 0;
          nb = 1;
        }
      }
    };
    
    this.move(n.milt(nc));
    b.move (b.mult(-nb));
    
    n = n.normalize();
    var v = vc.sub(vb);
    
    var e = 1;
    var j = ( - (1+e) * (v.dot(n))) / (this.invMass + b.invMass);
    
    var new_vc = vc.add(n.mult(j*this.invMass));
    var new_vb = vb.sub(n.mult(j*b.invMass));
    
    return {velocity1 : new_vc, velocity2 : new_vb };
  }
  
  
  return null;
  
};