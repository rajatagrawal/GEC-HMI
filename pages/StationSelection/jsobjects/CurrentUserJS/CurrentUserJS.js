export default {
	currentUserData: "",
	currentUserName: "",
	allPlantsForCurrentUser: "",
	defaultPlantForCurrentUser: "",
	getPlantForCurrentUser: "",
	dateAndTimeLastDeployedOrCurrentDay: "",
	fromWhereDateAndTimeLastDiployed: "",
	compilationVersion: "",
	newObjectWithAllPlantsForCurrentUser: [],
	userNameAndPlantToShow: "",

	onLoadSystemInformationModal() {
		if (SelectPlants_SI_Modal.selectedOptionValue.length === 0) {
			SelectPlants_SI_Modal.setSelectedOption(appsmith.store.PLANT.id);
		}
	},

	async getCurrentUserData() {
		if (!appsmith.store.USER) {
			const currentUserData = await ApiJS.smomMasterdataResourcesUsersCurrent();
			this.currentUserData = currentUserData;
			this.currentUserName = this.currentUserData.name;
			await storeValue('USER', currentUserData);
		} else {
			this.currentUserData = {id: appsmith.store.USER.id, name: appsmith.store.USER.name};
		}
		RefreshDateAndTimeJS.refreshDateAndTime();
		this.userNameAndPlantToShow = `${appsmith.store.USER.name}`;
		await this.getDefaultPlantForCurrentUserStation();
		await this.getAllPlantsForCurrentUser();
		this.getDateAndTimeLastDelpoyed();
		SelectPlants_SI_Modal.setSelectedOption(appsmith.store.PLANT.id);

		this.getUserNameAndPlantToShowForStationSelection();
	},

	async refreshAllPlantsToStore() {
		const getFields = ["id", "name"];
		this.newObjectWithAllPlantsForCurrentUser = this.allPlantsForCurrentUser.map(plant => {
			const newPlant = {};
			getFields.forEach(item => {
				newPlant[item] = plant[item];
			});
			return newPlant;
		});
		await storeValue('ALL_PLANTS', this.newObjectWithAllPlantsForCurrentUser);
	},

	async getAllPlantsForCurrentUser() {
		if(!appsmith.store.USER) {
			const allPlantsForCurrentUser = await ApiJS.smomMasterdataResourcesOrganizationunitsPlantsUser(this.currentUserData.id);
			this.allPlantsForCurrentUser = allPlantsForCurrentUser;
		}
		else {
			const allPlantsForCurrentUser = await ApiJS.smomMasterdataResourcesOrganizationunitsPlantsUser(appsmith.store.USER.id);
			this.allPlantsForCurrentUser = allPlantsForCurrentUser;
		}

		await this.refreshAllPlantsToStore();
		this.getPlantForCurrentUser = this.allPlantsForCurrentUser.find(obj => obj.id === this.defaultPlantForCurrentUser.plantId);
		const checkSelectedPlantExist = appsmith.store.PLANT && this.allPlantsForCurrentUser.find(obj => obj.id === appsmith.store.PLANT.id);
		const selectedPlantExists = checkSelectedPlantExist !== undefined ? true : false;
		if(appsmith.store.PLANT) {
			if (this.getPlantForCurrentUser.id !== appsmith.store.PLANT.id && !selectedPlantExists) {
				await this.setPlantToStore(this.getPlantForCurrentUser.id, this.getPlantForCurrentUser.name);
				storeValue('STATION_SELECTION', undefined);
				storeValue('WORKORDER', undefined);
				storeValue('PLANT', undefined);
				storeValue('WORKORDERS_PERIOD_OF_TIME', undefined);
				LogoutJS.logout();
				showAlert(TextJS[appsmith.store.LANG].ALERTS.PLANTS_LIST_CHANGED.SUCCESS, 'info');
				return;
			}
			return;
		}
		await this.setPlantToStore(this.getPlantForCurrentUser.id, this.getPlantForCurrentUser.name);
	},

	async getDefaultPlantForCurrentUserStation() {
		if(!appsmith.store.USER) {
			const defaultPlantForCurrentUser = await ApiJS.smomMasterdataResourcesPlantusersUserIdDefault(this.currentUserData.id);
			this.defaultPlantForCurrentUser = defaultPlantForCurrentUser;
		} else {
			const defaultPlantForCurrentUser = await ApiJS.smomMasterdataResourcesPlantusersUserIdDefault(appsmith.store.USER.id);
			this.defaultPlantForCurrentUser = defaultPlantForCurrentUser;
		}
	},

	async onPlantForCurrentUserChange() {
		if(!SelectPlants_SI_Modal.selectedOptionValue) {
			return;
		}
		await this.setPlantToStore(SelectPlants_SI_Modal.selectedOptionValue, SelectPlants_SI_Modal.selectedOptionLabel);
		this.clearDataAfterChangedPlant();
	},

	clearDataAfterChangedPlant() {
		showAlert(TextJS[appsmith.store.LANG].ALERTS.PLANT_CHANGE.SUCCESS, 'success');
		closeModal('SystemInformation');
		StationSelectionJS.optionsToSelectStationGroup = [];
		StationSelectionJS.disableStationGroupSelectField = false;
		StationSelectionJS.prepareOptionsToSelectLine();
		StationSelectionJS.dataListToDisplay = [];
		StationSelectionJS.defaultValueToSelectLine = "";
		storeValue('STATION_SELECTION', undefined);
		storeValue('WORKORDER', undefined);
		this.getCurrentUserData();
	},

	async setPlantToStore(plantId, plantName) {
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

	getUserNameAndPlantToShowForStationSelection() {
		if (!appsmith.store.PLANT) {
			this.userNameAndPlantToShow = `${appsmith.store.USER.name} (` + this.defaultPlantForCurrentUser + ')';	
		} else {
			this.userNameAndPlantToShow = `${appsmith.store.USER.name} (${appsmith.store.PLANT.name})`;
		}
	}

}