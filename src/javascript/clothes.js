class Item {
	constructor(config) {
		this.name = '';
		this.describe = '';
		this.img = '';
		this.needAcceptance = 0; // How high must be the player's acceptance before accepting to get the item
		this.price = 0; // If the item has a price, this will be its price

		this.specialUse = undefined; // Function for special items

		Object.keys(config).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);
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

class Clothes extends Item {
	constructor(config) {
		// this.slot = "";

		super(config);
	}

	clone() {
        return new Clothes(this);
    }

	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Clothes($ReviveData$)', ownData);
    }
}
Object.defineProperty(window, 'Clothes', {
    value : Clothes
});