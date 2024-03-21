export default {

	currentItemTheme: "",
	paramsData: {},

	MainMenuData: [
		{
			"id": "001",
			"navigateTo": "Workorders",
			"text": TextJS[appsmith.store.LANG].NAVIGATION_MENU.WORKORDERS,
			"theme": "secondary"
		},
		{
			"id": "002",
			"navigateTo": "Machine",
			"text": TextJS[appsmith.store.LANG].NAVIGATION_MENU.MACHINE,
			"theme": "primary"
		}
	],

	setCurrentItemBg(currentItem) {
		return currentItem.theme === "primary" ? "#0d9be2" : "#494948"
	},

	onClickMainMenuItem(currentItem) {
		switch (currentItem.navigateTo) {
			case "Workorders":
				this.paramsData = {
					name: appsmith.URL.queryParams.name,
					description: appsmith.URL.queryParams.description,
					id: appsmith.URL.queryParams.id,
					lineName: appsmith.URL.queryParams.lineName
				};
				break;
			default:
				return;
		}
		navigateTo(currentItem.navigateTo, this.paramsData, 'SAME_WINDOW');
	}

}