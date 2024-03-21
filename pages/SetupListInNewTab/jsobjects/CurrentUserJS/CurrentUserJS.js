export default {
	allPlantsForCurrentUser: "",
	defaultPlantForCurrentUser: "",
	getPlantForCurrentUser: "",
	dateAndTimeLastDeployedOrCurrentDay: "",
	fromWhereDateAndTimeLastDiployed: "",
	compilationVersion: "",
	attributeConfigValues: [],
	userNameAndPlantToShow: "",

	onLoadSystemInformationModal() {
		if (SelectPlants_SI_Modal.selectedOptionValue.length === 0) {
			SelectPlants_SI_Modal.setSelectedOption(appsmith.store.PLANT.id);
		}
	},

	async getCurrentUserDataForSetupListInNewTab() {
		this.getUserNameAndPlantToShowForSetupListInNewTab();
		RefreshDateAndTimeJS.refreshDateAndTime();
		this.getDateAndTimeLastDelpoyed();
		SelectPlants_SI_Modal.setSelectedOption(appsmith.store.PLANT.id);
	},

	async onPlantForCurrentUserChange() {
		if(!SelectPlants_SI_Modal.selectedOptionValue) {
			return;
		}
		await this.setPlantToStoreForSetupListInNewTab(SelectPlants_SI_Modal.selectedOptionValue, SelectPlants_SI_Modal.selectedOptionLabel);
		this.clearDataAfterChangedPlant();
	},

	clearDataAfterChangedPlant() {
		showAlert(TextJS[appsmith.store.LANG].ALERTS.PLANT_CHANGE.SUCCESS, 'success');
		storeValue('STATION_SELECTION', undefined);
		storeValue('WORKORDER', undefined);
		closeModal('SystemInformation');
		navigateTo('StationSelection', {
			"plantChenged": true
		}, 'SAME_WINDOW');
	},

	async setPlantToStoreForSetupListInNewTab(plantId, plantName) {
		await storeValue('PLANT', {
			id: plantId,
			name: plantName
		});
	},

	getDateAndTimeLastDelpoyed() {
		if (appsmith.store.DATA_AND_TIME_LAST_DEPLOYED_OR_MODIFIED_AT) {
			this.dateAndTimeLastDeployedOrCurrentDay = appsmith.store.DATA_AND_TIME_LAST_DEPLOYED_OR_MODIFIED_AT;
			this.fromWhereDateAndTimeLastDiployed = "_S";
		} else {
			this.dateAndTimeLastDeployedOrCurrentDay = moment().format('D.M.YYYY, HH:mm:ss');
			this.fromWhereDateAndTimeLastDiployed = "_L";
		}
		this.getCompilationVersion();
	}, 

	getCompilationVersion() {
		this.compilationVersion = `${appsmith.store.COMPILATION_VERSION}${this.fromWhereDateAndTimeLastDiployed}`;
	},

	getUserNameAndPlantToShowForSetupListInNewTab() {
		this.userNameAndPlantToShow = `${appsmith.store.USER.name} (${appsmith.store.PLANT.name})`;
	},

}