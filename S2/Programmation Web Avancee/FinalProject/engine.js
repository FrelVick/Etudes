/**
 * Created by Виктор on 05.04.2017.
 */
class engine{
    constructor(perso){
        this.perso = perso;
        this.framecounter = 0;
    }
    update() {
        //change character state

        if (Vars.leftarrow) {
            if (Vars.shift) {
                this.perso.ximpulse = - Constants.boostacceleration;
                this.perso.xmaxspeed = Constants.maxspeedboost;
            } else {
                this.perso.ximpulse = - Constants.acceleration;
                this.perso.xmaxspeed = Constants.maxspeed;
            }
        } else {
            if (Vars.rightarrow) {
                if (Vars.shift){
                    this.perso.ximpulse = Constants.boostacceleration;
                    this.perso.xmaxspeed = Constants.maxspeedboost;
                } else {
                    this.perso.ximpulse = Constants.acceleration;
                    this.perso.xmaxspeed = Constants.maxspeed;
                }
            } else {
                this.perso.xmaxspeed = 0;
            }
        }
        //this.perso.maxspeed = this.perso.boost ? Constants.maxspeedboost : ((Vars.leftarrow || Vars.rightarrow) ? Constants.maxspeed : 0);

        //x impulse to x speed

        this.perso.xspeed = Math.abs(this.perso.xspeed + this.perso.ximpulse) > this.perso.xmaxspeed ? this.perso.xspeed : (this.perso.xspeed + this.perso.ximpulse);
        this.perso.ximpulse = 0;

        //deceleration
        console.log("position:",this.perso.x, " speed:", this.perso.xspeed, " impulse", this.perso.ximpulse, "maxspeed", this.perso.xmaxspeed);

        this.perso.xspeed = Math.abs(this.perso.xspeed) > this.perso.xmaxspeed ? this.perso.xspeed * Constants.deceleration : this.perso.xspeed;
        this.perso.xspeed = Math.abs(this.perso.xspeed) < 0.05 ? 0 : this.perso.xspeed;

        //change x coordinate

        this.perso.x += this.perso.xspeed;

        this.framecounter += 1;
        if (this.framecounter > 5) {
            this.perso.redrawcharacter();
            this.framecounter = 0;
            this.perso.frame += 1;

            this.perso.frame %= 4;
        }
    }
}