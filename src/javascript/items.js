function False() {return false;} // Placeholder for tags
function True() {return true;}

class Item {
    constructor (config) {
        this.name = "Unnamed item";
        this.tags = {};

        Object.keys(config || {}).forEach(function (pn) {
            this[pn] = clone(config[pn]);
        }, this);
    }

    description(count, parent) {
        var str = String.format("<li class='itemDescription' id='{0}'>{0} ", this.name);
        if (count != Infinity) {
            str += String.format(
                "(Amnt: {0}) ",
                count
            );
        }
        if ((this.tags["shopItem"] || False)()) // False with capital letter refers to the function on the top of this page
        {
            str += String.format(
                "<<button 'Buy' '{2}'>><<= {0}.buyItem('{1}')>><<remove '#{1}'>><</button>>",
                parent,
                this.name,
                State.passage
            );
        }
        
        return str + "</li>";
    }

    addTag(tag, value) {
        if (this.tags[tag] === undefined)
        {
            this.tags[tag] = value || True; // True refers to the placeholder at the top of this file
        }
    }

    removeTag(tag) {
        delete this.tags[tag];
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