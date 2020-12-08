window.Player = class Player extends Character {
    constructor() {
        super();

        this.name = "Alex";
        this._color = "blue";
    }

    get color() {
        return this._color
    }
    get type() {return "Player"}
}