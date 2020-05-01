class Shop {
	constructor (config) {
		this.inventory = new Inventory({});
		this.name = "Unnamed shop";

		Object.keys(config || {}).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);
	}


	
	clone() {
        return new Shop(this);
    }

	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Shop($ReviveData$)', ownData);
	}
}
Object.defineProperty(window, 'Shop', {
    value : Shop
});