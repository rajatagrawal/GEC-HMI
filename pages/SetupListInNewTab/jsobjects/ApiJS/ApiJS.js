export default {

	responsestatus: '',
	application: 'frontend.global.user',

	async runFetch(dataRequest) {
		return fetch(dataRequest.url, dataRequest.config)
			.then(response => {
			if (response.status === 401) {
				LogoutJS.logout();
			}
			return response.json();
		})
			.catch(error => {
			showAlert(`${error}`,'error');
			console.error(`ERROR ${dataRequest.name} => ${error}`);
		});
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *  @param appsmith.store.refresh_jwt Refresh token, get from store
	 *  @param appsmith.store.jwt Access token, get from store
	 *	@api Keycloak
	 *	@throws Get access and refresh token
	 *	@private
	*/
	async refreshToken() {
		const bodyRefreshTokenData = new URLSearchParams({
			client_id: 'smartmom',
			grant_type:	'refresh_token',
			refresh_token: `${appsmith.store.refresh_jwt}`
		}).toString();

		const dataRequest = {
			url: `https://${appsmith.store.BASE_KEYCLOAK_URL}/auth/realms/oncite-dps/protocol/openid-connect/token`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				method: 'POST',
				body: bodyRefreshTokenData,
			},
			name: 'refreshToken'
		};
		return await this.runFetch(dataRequest);
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@param workorderId (appsmith.store.WORKORDER.id) Get current row in the Workorders tab
	 *	@api Smom workorders views
	 *	@throws Get the needed Bom Items for a given Workorder
	 *	@private
	*/
	async smomSmartmomResourcesWorkordersBomItems() {
		this.checkIfJWTExist();
		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/smartmom-svc/api/views/workorders/${appsmith.store.WORKORDER.workorderId}/bomitems`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`,
					'X-PlantId': appsmith.store.PLANT.id
				},
				method: 'GET',
			},
			name: 'smomSmartmomResourcesWorkordersBomItems'
		};
		return await this.runFetch(dataRequest);
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@api Masterdata keycloak resources
	 *	@throws Get user data of current user
	 *	@private
	*/
	async smomMasterdataResourcesKeycloakUsersCurrent() {
		this.checkIfJWTExist();
		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/masterdata-svc/api/resources/keycloak/users/current`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`
				},
				method: 'GET',
			},
			name: 'smomMasterdataResourcesKeycloakUsersCurrent'
		};
		return await this.runFetch(dataRequest);
	},

	/**
	 *	@param appsmith.store.BASE_KEYCLOAK_URL Get from store, main url keycloak server
	 *	@private
	*/
	async keycloakLogout() {
		const dataRequest = {
			url: `https://${appsmith.store.BASE_KEYCLOAK_URL}/auth/realms/oncite-dps/protocol/openid-connect/logout`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`
				},
				method: 'POST',
			},
			name: 'keycloakLogout'
		};
		return await this.runFetch(dataRequest);
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@api Masterdata users resources
	 *	@throws Get the User that is actually logged in via JWT
	 *	@private
	*/
	async smomMasterdataResourcesUsersCurrent() {
		this.checkIfJWTExist();
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
	 *	@param userId of the current user taken from the smomMasterdataResourcesUsersCurrent method
	 *	@api Masterdata organizationunits resources
	 *	@throws Get the Plant for the given id
	 *	@private
	*/
	async smomMasterdataResourcesOrganizationunitsPlantsUser(userId) {
		this.checkIfJWTExist();
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

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@param userName of the current user taken from the smomMasterdataResourcesUsersCurrent method
	 *	@api Configurations configvalues resources
	 *	@throws Get or create the ConfigurationValue for the given Application and User
	 *	@private
	*/
	async smomAttributeResourcesConfigvaluesGet(userName) {
		this.checkIfJWTExist();
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
	 *	@param userName of the current user taken from the smomMasterdataResourcesUsersCurrent method
	 *	@param language selected of the current user
	 *	@api Configurations configvalues resources
	 *	@throws Update or create the ConfigurationValue for the given Application and User
	 *	@private
	*/
	async smomAttributeResourcesConfigvaluesUpdate(userName, language) {
		this.checkIfJWTExist();
		const requestData = {
			application: this.application,
			userName: `${userName}`
		};

		const bodyRequestData = `${language}`;

		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/attribute-svc/api/resources/configvalues/application/${requestData.application}/userName/${requestData.userName}/valueName/language`,
			config: {
				headers: {
					accept: 'application/json',
					'Accept-Language': `${language}`,
					Authorization: `Bearer ${appsmith.store.jwt}`,
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: bodyRequestData,
			},
			name: 'smomAttributeResourcesConfigvaluesUpdate'
		};
		return await this.runFetch(dataRequest);
	},

	checkIfJWTExist() {
		if(!appsmith.store.jwt){
			LogoutJS.logout();
		}
	},

}