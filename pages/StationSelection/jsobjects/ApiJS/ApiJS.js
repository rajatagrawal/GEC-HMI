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
			if (response.status === 401) {
				LogoutJS.logout();
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
	 *  @param appsmith.store.refresh_jwt Refresh token, get from store
	 *  @param appsmith.store.jwt Access token, get from store
	 *	@api Keycloak
	 *	@throws Get access and refresh token
	 *	@private
	*/
	async refreshToken() {
		if (!appsmith.store.refresh_jwt) {
			console.log(`ERROR refresh_jwt => ${appsmith.store.refresh_jwt}`);
			return;
		}
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

		try {
			const response = await this.runFetch(dataRequest);
			if(!response) {
				LogoutJS.logout();
			}
			return response;
		} catch (error) {
			showAlert(`${error}`, 'error');
			console.error(`ERROR ${dataRequest.name} => ${error}`);
		}
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
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@param orgaznizationUnitId (Select1.selectedOptionValue) Get from store, main url api server
	 *	@api Masterdata organizationunits views
	 *	@throws Get Childs OrganizationUnit for given OrgUnitId. The result is empty, when no childs are available
	 *	@private
	*/
	async smomMasterdataViewsOrganizationunitsOrganizationunitIdTreeChilds(selectedItem) {
		this.checkIfJWTExist();
		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/masterdata-svc/api/views/organizationunits/${selectedItem}/tree/childs`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`,
					'X-PlantId': appsmith.store.PLANT.id
				},
				method: 'GET',
			},
			name: 'smomMasterdataViewsOrganizationunitsOrganizationunitIdTreeChilds'
		};
		return await this.runFetch(dataRequest);
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@api Smom organizationunits resources
	 *	@throws Get OrganizationUnit by Filter
	 *	@private
	*/
	async smomSmartmomResourcesOrganizationunits() {
		this.checkIfJWTExist();
		const params = { limit: 1000, type: 'LINE' };
		const queryString = Object.entries(params)
		.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
		.join('&');
		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/smartmom-svc/api/resources/organizationunits?${queryString}`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`,
					'X-PlantId': appsmith.store.PLANT.id
				},
				method: 'GET',
			},
			name: 'smomSmartmomResourcesOrganizationunits'
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