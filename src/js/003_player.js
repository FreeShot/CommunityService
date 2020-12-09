window.Player = class Player extends Character {
    constructor() {
        super();

        this.name    = "Alex";
        this.femname = "Alice";
        this.title   = "servant";

        this._color  = "blue";
        this.voice   = {cur: 0, abs: 0};

        this.femininity = 0;
        this.appearance = 0;
        this.submission = 0;
        this.boldness   = 0;

        this.stamina = {cur: 100, max: 100};
        this.arousal = {cur:   0, max: 100};
    }

    rest(amnt = this.stamina.max) {
        this.stamina.cur = Math.min(this.stamina.max, amnt + this.stamina.cur)
    }

    get color() {
        return utils.color.toHex(
            utils.color.mix(
                {r:  10, g: 100, b: 200},
                {r: 250, g: 100, b: 200}, 
                this.femininity
            )
        );
    }

    get type() {return "Player"}
}