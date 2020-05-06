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
			this.items.push({"item" : item, "count" : count || Infinity});
		}
	}

	findItemIndex(item) {
		return this.items.findIndex(function(el){return el.item.name == item;});
	}

	filter(wl, bl)
	{
		var items = this.items;
		if (wl !== undefined)
		{
			items = items.filter(function(el){
				return el.item.tags.some(function(tag) {return wl.includes(tag)});
			});
		}
		if (bl !== undefined)
		{
			items = items.filter(function(el){
				return !el.items.tags.some(function(tag) {return bl.includes(tag)});
			});
		}
		return items;
	}

	listItem(parent, wl, bl) {
		var str = String.format("{0} <ul>", this.name);
		var items = this.filter(wl, bl);
		items.forEach(function(el){
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
		amount = amount || 1;
		// TODO: Add price
		var i = this.items.findIndex(function(el){return el.item.name == item;});
		if (i !== undefined)
		{
			this.items[i].count -= amount || 1;
			var item = this.items[i].item.clone();
			item.removeTag("shopItem");
			State.variables.player.inv.addItem(
				item, 
				this.items[i].count <= 0 ? this.items[i].count + amount : amount
			);
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