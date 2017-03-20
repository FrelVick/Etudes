/**
 * Created by viktor.frelikh on 27/02/17.
 */
var A = function () {
    this.msg = "Bonjour";
};;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

A.prototype.talk = function () {
    console.log(this.msg);
};;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

var B = function () {
    A.call(this);
    this.msg += " tout le monde";
};;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

B.prototype = Object.create(A.prototype);
B.prototype.say = A.prototype.talk;
var a = new A();
var b = new B();

function countDown(n) {
    var i;
    for (i = n; i >= 0; i--) {
        setTimeout(function () {
            console.log(i);
        }, 1000 * (n - i));
    }
}