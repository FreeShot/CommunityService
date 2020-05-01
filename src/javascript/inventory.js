class Inventory {
	constructor(config) {
		this.items = [];
		this.name = "Default";

		Object.keys(config || {}).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);
	}

	addItem(item, count)
	{
		if (this.items.find(function(el){return el.item.name == item.name}))
		{
			this.items.find(function(el){return el.item.name == item.name}).count += count || 1;
		} else {
			this.items.push({"item" : item, "count" : count || 1});
		}
	}

	listItem() {
		var str = String.format("{0} <ul>", this.name);
		this.items.forEach(function(el){
			str += String.format(
				"<li>{0}</li>", 
				el.item.description(el.count), 
		)});
		return str + "</ul>";
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