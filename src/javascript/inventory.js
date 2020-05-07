function ItemSorter(a, b) {
	var tagOrder = ["wig", "shirt", "pants", "underwear", "hoistery", "shoe"];
	var tagIndexA = tagOrder.length;
	a.item.tags.forEach(function(tag) {
		var i = tagOrder.findIndex(t => t == tag);
		if (i != -1 && tagIndexA > i) {
			tagIndexA = i;
		}
	});

	var tagIndexB = tagOrder.length;
	b.item.tags.forEach(function(tag) {
		var i = tagOrder.findIndex(t => t == tag);
		if (i != -1 && tagIndexB > i) {
			tagIndexB = i;
		}
	});
	if (tagIndexA == tagIndexB) {
		return a.item.feminity - b.item.feminity;
	}
	return tagIndexA - tagIndexB;
}

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
		if (item.constructor == Object)
		{
			item = new Item(item);
		}
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
				var hasAll = true;
				wl.forEach(function(tag) {
					hasAll &= el.item.tags.includes(tag)
				});
				return hasAll;
			});
		}
		if (bl !== undefined)
		{
			items = items.filter(function(el){
				return !el.item.tags.some(function(tag) {return bl.includes(tag)});
			});
		}
		return items;
	}

	listItem(parent, storage, wl, bl) {
		var str = String.format("{0} <ul>", this.name);
		var items = this.filter(wl, bl);
		items.sort(ItemSorter);
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
				),
				storage
			);
		}, this);
		return str + "</ul>";
	}

	buyItem(item, price, amount)
	{
		amount = amount || 1;
		price = price || 0;
		// TODO: Add price
		var i = this.items.findIndex(function(el){return el.item.name == item;});
		if (i !== undefined && State.variables.player.money >= price)
		{
			this.items[i].count -= amount || 1;
			var item = this.items[i].item.clone();
			item.removeTag("shopItem");
			State.variables.player.money -= price;
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