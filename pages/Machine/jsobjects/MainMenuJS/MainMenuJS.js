export default {

	currentItemTheme: "",
	paramsData: {},

	MainMenuData: [
		{
			"id": "001",
			"navigateTo": "Workorders",
			"text": TextJS[appsmith.store.LANG].NAVIGATION_MENU.WORKORDERS,
			"theme": "secondary",
			"icon": "shopping-cart"
		},
		{
			"id": "002",
			"navigateTo": "Machine",
			"text": TextJS[appsmith.store.LANG].NAVIGATION_MENU.MACHINE,
			"theme": "primary",
			"icon": "chart"
		}
	],

	refreshMainMenuDataForTranslations() {
		let newText;
		this.MainMenuData = this.MainMenuData.map((obj) => {
			switch(obj.id) {
				case "001":
					newText = TextJS[appsmith.store.LANG].NAVIGATION_MENU.WORKORDERS;
					break;
				case "002":
					newText = TextJS[appsmith.store.LANG].NAVIGATION_MENU.MACHINE;
					break;
				default:
					newText = obj.text;
			}
			return {...obj, text: newText};
		});
	},

	setCurrentItemBg(currentItem) {
		return currentItem.theme === "primary" ? "#0d9be2" : "#494948"
	},

	onClickMainMenuItem(currentItem) {
		this.MainMenuData.map(item => {
			if (currentItem.navigateTo === 'Machine') {
				return;
			}
			this.paramsData = {
				name: appsmith.URL.queryParams.name,
				description: appsmith.URL.queryParams.description,
				id: appsmith.URL.queryParams.id,
				lineName: appsmith.URL.queryParams.lineName
			};
			navigateTo(currentItem.navigateTo, this.paramsData, 'SAME_WINDOW');
		});
	}

}