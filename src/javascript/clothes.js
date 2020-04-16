class Item {
	constructor(config) {
		this.name = '';
		this.describe = '';
		this.img = '';
		this.needAcceptance = 0; // How high must be the player's acceptance before accepting to get the item
		this.price = 0; // If the item has a price, this will be its price

		this.use = undefined; // Function for special items

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
		super(Object.assign({
            slots: [],
            equipped: false
        },config));
	}

    equip(char) {
        this.slots.forEach(function (el) {
            var slot = char.getSlot(el);
            if (slot !== undefined) {
                slot.equipped.unequip();
            }
            slot.equipped = this;
        }, this);

        this.equipped = true;
    }

    unequip() {
        this.equipped = false;
    }

    display() {
        var str = String.format(
            "{0} : {1} [{2}]",
            this.name,
            this.describe,
            this.slots.join(",")
        );
        if (this.equipped) {str += "(equipped)"}
        return str;
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