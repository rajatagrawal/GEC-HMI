export default {

	responsestatus: '',
	application: 'frontend.global.user',

	async runFetch(dataRequest) {
		try {
			const response = await fetch(dataRequest.url, dataRequest.config);
			if (response.status === 200) {
				return await response.json();
			}
			if (!response.ok) {
				console.error(`ERROR runFetch => ${dataRequest.name} => response.status ${response.status}`);
			}
		} catch (error) {
			showAlert(`${error}`, 'error');
			console.error(`ERROR ${dataRequest.name} => ${error}`);
		}
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@throws Get url to token
	*/
	urlToken() {
		return `https://${appsmith.store.BASE_KEYCLOAK_URL}/auth/realms/oncite-dps/protocol/openid-connect/token`;
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@api Masterdata users resources
	 *	@throws Get the User that is actually logged in via JWT
	 *	@private
	*/
	async smomMasterdataResourcesUsersCurrent() {
		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/masterdata-svc/api/resources/users/current`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`
				},
				method: 'GET',
			},
			name: 'smomMasterdataResourcesUsersCurrent'
		};
		return await this.runFetch(dataRequest);
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@param userName of the current user taken from the smomMasterdataResourcesUsersCurrent method
	 *	@api Configurations configvalues resources
	 *	@throws Get or create the ConfigurationValue for the given Application and User
	 *	@private
	*/
	async smomAttributeResourcesConfigvaluesGet(userName) {
		const requestData = {
			application: this.application,
			userName: `${userName}`,
			valueName: "language"
		};

		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/attribute-svc/api/resources/configvalues/application/${requestData.application}/userName/${requestData.userName}/valueName/${requestData.valueName}`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`
				},
				method: 'GET',
			},
			name: 'smomAttributeResourcesConfigvaluesGet'
		};
		return await this.runFetch(dataRequest);
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@param userId of the current user taken from the smomMasterdataResourcesUsersCurrent method
	 *	@api Masterdata organizationunits resources
	 *	@throws Get the Plant for the given id
	 *	@private
	*/
	async smomMasterdataResourcesOrganizationunitsPlantsUser(userId) {
		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/masterdata-svc/api/resources/organizationunits/plants/user/${userId}`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`
				},
				method: 'GET',
			},
			name: 'smomMasterdataResourcesOrganizationunitsPlantsUser'
		};
		return await this.runFetch(dataRequest);
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@param userId of the current user taken from the smomMasterdataResourcesUsersCurrent method
	 *	@api Masterdata plantusers resources
	 *	@throws Get the default PlantUser for a UserId
	 *	@private
	*/
	async smomMasterdataResourcesPlantusersUserIdDefault(userId) {
		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/masterdata-svc/api/resources/plantusers/userId/${userId}/default`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`
				},
				method: 'GET',
			},
			name: 'smomMasterdataResourcesPlantusersUserIdDefault'
		};
		return await this.runFetch(dataRequest);
	},

}