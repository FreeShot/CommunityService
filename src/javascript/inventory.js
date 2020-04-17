class Inventory {
	constructor(config) {
		this.items = [];
		this.clothes = [];
		this.canBuy = true;
		this.canSell = false;
		this.money = 0;
		this.owner = null;

		Object.keys(config).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);
	}

	addItem(item) {
		if (item.type === "clothes") {
			this.clothes.push(item);
		} else {
			this.items.push(item);
		}
	}

	removeItem(item) {
		var itemSelect = this.clothes.find(function(el) {return el.id === item});
		this.clothes = this.clothes.filter(function(el) {return el.id != item});
		if (itemSelect !== undefined) {
			return itemSelect;
		} else {
			itemSelect = this.items.find(function(el) {return el.id === item});
			this.items = this.items.filter(function(el){return el.id != item});
			return itemSelect;
		}
	}

	buy(shop, item) {
		if (this.canBuy && shop.canSellItem(item)) {
			this.addItem(shop.removeItem(item));
		}
	}

	canSellItem(item) {
		return this.canSell && (
				this.clothes.some(function(el) {return el.id == item}) ||
				this.items.some(function(el) {return el.id == item})
			);
	}

	equip(item) {
		if (this.owner != null) {
			this.clothes.find(function(el) {return el.id === item}).equip(this.owner);
		}
		return this.owner;
	}

	clone() {
        return new Inventory(this);
    }

	toJSON() {
        var ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper('new Inventory($ReviveData$)', ownData);
    }
}
Object.defineProperty(window, 'Inventory', {
    value : Inventory
});