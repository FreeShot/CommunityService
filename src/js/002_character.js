window.Character = class Character extends Serializable {
    constructor(name, title, color) {
        super();
        this.name = name;
        this.title = title;
        this._color = color;
    }

    get color() {
        return this._color;
    }

    get type() {return "Character"}
}