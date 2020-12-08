Macro.add("speak", {
    tags: [],
    handler: function() {
        const color = typeof(this.args[0]) === "string" ? this.args[0] : this.args[0].color;
        const thought = this.args[1];
        const content = this.payload[0].contents;

        const speach = thought ? $("<i></i>") : $("<span></span>");
        $(speach).wiki(`"${content}"`);
        $(speach).css("color", color);

        $(this.output).append(speach);
    }
})