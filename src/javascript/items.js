class Item {
    constructor (config) {
        this.name = "Unnamed item";

        Object.keys(config || {}).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);
    }

    description(count) {
        return String.format(
            "{0} ({1})",
            this.name,
            count
        );
    }
    
    clone() {
        return new Item(this);
    }

    toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Item($ReviveData$)', ownData);
    }
}
Object.defineProperty(window, 'Item', {
    value : Item
});