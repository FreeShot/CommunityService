class Item {
	constructor(config) {
		this.id = '';
        this.name = '';
        this.type = 'genericItem';
        this.price = 0;
		
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
            type: "clothes",
            clothesType: "",
            equipped: false
        },config));
	}

    equip(char) {
        State.variables.clothesTypeSlots[this.clothesType].forEach(function (el) {
            var slot = char.getSlot(el);
            if (slot.equipped !== null) {
                slot.equipped.unequip();
            }
            char.equipped(el, this);
        }, this);
        this.equipped = true;
    }

    unequip() {
        State.variables.clothesTypeSlots[this.clothesType].forEach(function (el) {
            var slot = char.getSlot(el);
            if (slot.equipped.id === this.id){
                char.equipped(el, null);
            }
        }, this)
        this.equipped = false;
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