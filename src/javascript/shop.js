class Shop {
	constructor (config) {
		this.categories = [];
		this.name = "Unnamed shop";
		this.id = "shop"; // Id must be same as the variable name

		Object.keys(config || {}).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);
	}

	addCategory(categoryName)
	{
		this.categories.push(new Inventory({"name": categoryName, "isShop": true}));
	}

	addItem(category, item, count)
	{
		this.getCategory(category).addItem(item, count);
	}

	getAsTemp(itemName){
		for (var i = 0; i < this.categories.length; i++) {
			var item = this.categories[i].getAsTemp(itemName);
			if (item !== undefined) {return item;}
		}
	}

	getCategory(category)
	{
		return this.categories.find(
			function(el){return el.name == category});
	}

	listItem()
	{
		var str = String.format(
			"<ul id='{0}'>",
			this.id
		);
		var name = this.name;
		this.categories.forEach(function(el) {
			str += String.format(
				"<li>{0}</li>",
				el.listItem(String.format(
					"State.variables['{0}']",
					this.id
				))
			);
		}, this);
		return str + "</ul>";
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