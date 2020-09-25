function ItemSorter(a, b) {
	// Prefer equipped, low femininity, lowest clothes

	if(a.item.tags.includes("equipped") || b.item.tags.includes("equipped"))
		return a.item.tags.includes("equipped") ? -1 : 1;

	var tagIndexA = ClothesSlots.length;
	a.item.tags.forEach((tag) => {
		var i = ClothesSlots.findIndex(t => t == tag);
		if (i != -1 && tagIndexA > i)
			tagIndexA = i;
	});

	var tagIndexB = ClothesSlots.length;
	b.item.tags.forEach((tag) => {
		var i = ClothesSlots.findIndex(t => t == tag);
		if (i != -1 && tagIndexB > i)
			tagIndexB = i;
	});
	if (tagIndexA == tagIndexB)
		return a.item.femininity - b.item.femininity;
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

	addItem(item, count, autoEquip)
	{
		if (item.constructor == Object)
			item = new Item(item);
		if (this.isShop) 
			item.addTag("shopItem");
		if (this.items.find(function(el){return el.item.name == item.name}))
			this.items.find(function(el){return el.item.name == item.name}).count += count || 1;
		else
			this.items.push({"item" : item, "count" : count || Infinity});
		if (autoEquip || false)
			State.variables.player.equip(item.name, true);
	}

	removeItem(item, count) {
		var i = this.items.findIndex((el) => el.item.name == item);
		this.items[i].count -= amount || 1;
		var item = this.items[i].item.clone();
		this.items = this.items.filter((el) => el.count > 0);
		return item;
	}

	getAsTemp(itemName) {
		var index = this.findItemIndex(itemName);
		if (index != -1) {
			var item = this.items[index].item.clone();
			item.addTag("tmp");
			return item;
		} 
		return undefined;
	}

	removeTmp(keepEquipped) {
		this.items = this.items.filter((el) => (!el.item.tags.includes("tmp")) || (keepEquipped && el.item.tags.includes("equipped")));
	}

	findItemIndex(item) {
		return this.items.findIndex((el) => el.item.name == item);
	}

	filter(wl, bl)
	{
		var items = this.items;
		if (wl !== undefined)
			items = items.filter((el) => wl.find((tag) => el.item.tags.includes(tag)));
		if (bl !== undefined)
			items = items.filter((el) => !el.item.tags.some((tag) => bl.includes(tag)));
		return items;
	}

	listItem(parent, wl, bl, displayName, canEquip) {
		var items = this.filter(wl, bl);
		items.sort(ItemSorter);

		var str = items.reduce(
		    (str, item) => str + item.item.description(item.count, parent || (`State.variables.${this.name}`), canEquip), 
		    `<div class="inventory-display"><div class="inventory-name">${displayName || this.name}</div>`);

		var i = 0;
		while ((i + items.length) % settings.inventoryRows !== 0) {
			str += `<div class="inventory-display-empty"></div>`
			i++;
		}

		return str + "</div>";
	}

	buyItem(item, price, amount)
	{
		amount = amount || 1;
		price = price || 0;
		// TODO: Add price
		var i = this.items.findIndex((el) => el.item.name == item);
		if (i !== undefined && State.variables.player.money >= price)
		{
			var item = this.removeItem(el.item.name);
			item.removeTag("shopItem");
			State.variables.player.money -= price;
			State.variables.player.inv.addItem(
				item, 
				this.items[i].count <= 0 ? this.items[i].count + amount : amount
			);
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