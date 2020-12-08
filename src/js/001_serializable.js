// Base serializable class for all other classes
window.Serializable = class Serializable {
    constructor() {}

    _init(obj) {
        Object.keys(obj).forEach(key => {
            this[key] = clone(obj[key])
        });
        return this;
    }
    clone() { return (new this.constructor())._init(this); }
    toJSON() {
        let ownData = {};
        Object.keys(this).forEach(key => {
            ownData[key] = clone(this[key])
        });
        return JSON.reviveWrapper(`(new ${this.type})._init($ReviveData$)`, ownData)
    }
    get type() {return "Serializable"}
}