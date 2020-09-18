Setting.addHeader("Display");
Setting.addList("inventoryRows", {
	label    : "Number of rows in the inventory",
	list: [1, 2, 3, 4, 5],
	default  : 4,
	onInit: () => document.documentElement.style.setProperty("--inventoryRow", settings.inventoryRows),
	onChange: () =>	document.documentElement.style.setProperty("--inventoryRow", settings.inventoryRows)
});