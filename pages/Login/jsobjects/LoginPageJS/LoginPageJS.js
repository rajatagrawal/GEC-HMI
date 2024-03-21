export default {

	currentUserName: "",
	currentUserData: "",
	attributeConfigValues: [],
	allPlantsForCurrentUser: "",
	defaultPlantForCurrentUser: "",
	getPlantForCurrentUser: "",
	newObjectWithAllPlantsForCurrentUser: [],

	login() {
		const tokenUrl = ApiJS.urlToken();
		const encodedData = new URLSearchParams({
			grant_type: 'password',
			username: UsernameInput.text,
			password: PasswordInput.text,
			client_id: appsmith.store.KEYCLOAK_CLIENT_ID,
			client_secret: ''
		}).toString();

		fetch(tokenUrl, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			method: 'POST',
			body: encodedData
		}).then(response => {
			if(response.status === 200) {
				return response.json()
			}
			return response.json().then(json => { throw new Error(json) })
		}).then(data => this.loginSuccess(data)).catch(error => this.loginError(error))
	},

	async getBasicSettings() {
		await this.getCurrentUserData();
		await this.getAttributeConfigValues();
		await this.getDefaultPlantForCurrentUser();
		await this.getAllPlantsForCurrentUser();
		this.getPlantForCurrentUser = this.allPlantsForCurrentUser.find(obj => obj.id === this.defaultPlantForCurrentUser.plantId);
		const defaultLanguage = !this.attributeConfigValues.value ? "en" : this.attributeConfigValues.value;

		if(!appsmith.store.PLANT) {
			await storeValue('PLANT', {
				id: this.getPlantForCurrentUser.id,
				name: this.getPlantForCurrentUser.name
			});
		}
		await storeValue('LANG', defaultLanguage);
		await storeValue('USER', this.currentUserData);
		await storeValue('ALL_PLANTS', this.newObjectWithAllPlantsForCurrentUser);
	},

	async getCurrentUserData() {
		const currentUserData = await ApiJS.smomMasterdataResourcesUsersCurrent();
		this.currentUserData = currentUserData;
		this.currentUserName = this.currentUserData.name;
	},

	async getAttributeConfigValues() {
		const attributeConfigValues = await ApiJS.smomAttributeResourcesConfigvaluesGet(this.currentUserName);
		this.attributeConfigValues = attributeConfigValues;
	},

	async getDefaultPlantForCurrentUser() {
		const defaultPlantForCurrentUser = await ApiJS.smomMasterdataResourcesPlantusersUserIdDefault(this.currentUserData.id);
		this.defaultPlantForCurrentUser = defaultPlantForCurrentUser;
	},

	async getAllPlantsForCurrentUser() {
		const allPlantsForCurrentUser = await ApiJS.smomMasterdataResourcesOrganizationunitsPlantsUser(this.currentUserData.id);
		this.allPlantsForCurrentUser = allPlantsForCurrentUser;
		this.setAllPlants();
	},

	setAllPlants() {
		const getFields = ["id", "name"];
		this.newObjectWithAllPlantsForCurrentUser = this.allPlantsForCurrentUser.map(plant => {
			const newPlant = {};
			getFields.forEach(item => {
				newPlant[item] = plant[item];
			});
			return newPlant;
		});

	},

	async loginSuccess(data) {
		await storeValue('jwt', data.access_token);
		await storeValue('refresh_jwt', data.refresh_token);
		await storeValue('id_token', data.id_token);
		showAlert(TextJS.LOGIN_SUCCESS, "success");
		await this.getBasicSettings();
		if (appsmith.store.STATION_SELECTION && appsmith.store.STATION_SELECTION.lineId) {
			navigateTo("Workorders");
		} else {
			navigateTo('StationSelection');
		}
	},

	loginError(error) {
		showAlert(TextJS.LOGIN_ERROR, "error");
		this.reset();
		console.error(error);
	},

	reset() {
		storeValue('jwt', undefined);
		storeValue('refresh_jwt', undefined);
		storeValue('id_token', undefined);
	}

}