class Inventory {
	constructor(config) {
		this.items = [];
		this.name = "Default";
		this.isShop = false; 

		Object.keys(config || {}).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);
	}

	addItem(item, count)
	{
		if (this.isShop) 
			item.addTag("shopItem");
		if (this.items.find(function(el){return el.item.name == item.name}))
		{
			this.items.find(function(el){return el.item.name == item.name}).count += count || 1;
		} else {
			this.items.push({"item" : item, "count" : count || 1});
		}
	}

	findItemIndex(item) {
		return this.items.findIndex(function(el){return el.item.name == item;});
	}

	listItem(parent) {
		var str = String.format("{0} <ul>", this.name);
		this.items.forEach(function(el){
			str += el.item.description(
				el.count, 
				parent !== undefined ?
				String.format(
					"{0}.getCategory(['{1}'])",
					parent,
					this.name
				) : String.format(
					"State.variables['{0}']",
					this.name
				)
			);
		}, this);
		return str + "</ul>";
	}

	buyItem(item, amount)
	{
		// TODO: Add price
		var i = this.items.findIndex(function(el){return el.item.name == item;});
		if (i !== undefined)
		{
			this.items[i].count -= amount || 1;
			var amountLeft = this.items[i].count > 0 ? amount : amount + this.items[i].count;
			var item = this.items[i].item;
			item.removeTag("shopItem");
			State.variables.playerInv.addItem(item, amountLeft);
			this.items = this.items.filter(function(el){return el.count > 0});
		}
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