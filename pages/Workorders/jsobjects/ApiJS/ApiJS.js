export default {

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
	 *  @param documentId (currentItem.documentId) Get clicked item of the document list
	 *	@throws Get url to the page for the blob
	*/
	urlTransactionDataDocumentPreview(documentId) {
		return `https://${appsmith.store.BASE_SMARTMOM_API_URL}/transactiondata/#documents/preview/${documentId}`;
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
	 *	@param partId (appsmith.URL.queryParams.id) Get from each workorders
	 *	@api Smom organizationunits resources
	 *	@throws Get the part for the given id
	 *	@private
	*/
	async smomMasterdataResourcesPartsPartId(partId) {
		this.checkIfJWTExist();
		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/masterdata-svc/api/resources/parts/${partId}`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`,
					'X-PlantId': appsmith.store.PLANT.id
				},
				method: 'GET',
			},
			name: 'smomMasterdataResourcesPartsPartId'
		};
		return await this.runFetch(dataRequest);
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@param organizationUnitId (appsmith.store.STATION_SELECTION.stationId) Get from the store after selecting a station from previous page
	 *	@api Smom organizationunits resources
	 *	@throws Get the next workorder for given organizationUnitId
	 *	@private
	*/
	async smomSmartmomViewOrganizationunitsWorkorders() {
		this.checkIfJWTExist();
		const params = { limit: 15, toDate: appsmith.store.WORKORDERS_PERIOD_OF_TIME.toDate };
		const queryString = Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/smartmom-svc/api/views/organizationunits/${appsmith.store.STATION_SELECTION.stationId}/workorders?${queryString}`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`,
					'X-PlantId': appsmith.store.PLANT.id
				},
				method: 'GET',
			},
			name: 'smomSmartmomViewOrganizationunitsWorkorders'
		};
		return await this.runFetch(dataRequest);
	},
	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@param organizationUnitId (appsmith.store.STATION_SELECTION.stationId) Get from the store after selecting a station from previous page
	 *	@api Smom organizationunits resources
	 *	@throws Get a List of Workorder/worksteps that are activated for the given OrganizationUnitId and its children
	 *	@private
	*/
	async smomSmartmomResourcesOrganizationunitsWorkorders() {
		this.checkIfJWTExist();
		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/smartmom-svc/api/resources/organizationunits/${appsmith.store.STATION_SELECTION.stationId}/workorders`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`,
					'X-PlantId': appsmith.store.PLANT.id
				},
				method: 'GET',
			},
			name: 'smomSmartmomResourcesOrganizationunitsWorkorders'
		};
		return await this.runFetch(dataRequest);
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *  @param organizationUnitId (appsmith.store.STATION_SELECTION.stationId) Get from the store after selecting a station from previous page
	 *	@param workorderId (WorkordersJS.currentRow.id) Get current row
	 *	@api Smom workorders resources
	 *	@throws Activate the organizationUnit for a workorder
	 *	@private
	*/
	async smomSmartmomResourcesOrganizationunitsWorkordersWorkorderIdActivate() {
		this.checkIfJWTExist();
		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/smartmom-svc/api/resources/organizationunits/${appsmith.store.STATION_SELECTION.stationId}/workorders/${WorkordersJS.currentRow.workorderId}`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`,
					'X-PlantId': appsmith.store.PLANT.id
				},
				method: 'PUT',
			},
			name: 'smomSmartmomResourcesOrganizationunitsWorkordersWorkorderIdActivate'
		};

		return fetch(dataRequest.url, dataRequest.config)
			.then(response => {
			return response.json();
		}).then(response => {
			showAlert(TextJS[appsmith.store.LANG].ALERTS.WORKORDER_ACTIVATE.SUCCESS, 'success')
			return response;
		}).catch(error => {
			console.error(`ERROR ${dataRequest.name} => ${error}`);
			showAlert(TextJS[appsmith.store.LANG].ALERTS.WORKORDER_ACTIVATE.ERROR, 'error')
		});
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *  @param organizationUnitId (appsmith.store.STATION_SELECTION.stationId) Get from the store after selecting a station from previous page
	 *	@param workorderId (WorkordersJS.currentRow.id) Get current row
	 *	@api Smom workorders resources
	 *	@throws Remove the activation of OrganizationUnits from a Workorder
	 *	@private
	*/
	async smomSmartmomResourcesOrganizationunitsWorkordersWorkorderIdDeactivate() {
		this.checkIfJWTExist();
		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/smartmom-svc/api/resources/organizationunits/${appsmith.store.STATION_SELECTION.stationId}/workorders/${WorkordersJS.currentRow.workorderId}`,
			config: {
				'content-type': 'application/x-www-form-urlencoded', 
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`,
					'X-PlantId': appsmith.store.PLANT.id
				},
				method: 'DELETE',
			},
			name: 'smomSmartmomResourcesOrganizationunitsWorkordersWorkorderIdDeactivate'
		};

		return fetch(dataRequest.url, dataRequest.config)
			.then(response => {
			return response.json();
		}).then(response => {
			showAlert(TextJS[appsmith.store.LANG].ALERTS.WORKORDER_DEACTIVATE.SUCCESS, 'success')
			return response;
		}).catch(error => {
			console.error(`ERROR ${dataRequest.name} => ${error}`);
			showAlert(TextJS[appsmith.store.LANG].ALERTS.WORKORDER_DEACTIVATE.ERROR, 'error')
		});
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@param workorderId (WorkordersJS.currentRow.id) Get current row
	 *	@api Smom workorders resources
	 *	@throws Set the Workorder state to finished
	 *	@public
	*/
	async smomSmartmomResourcesWorkordersSatetFinished() {
		this.checkIfJWTExist();
		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/smartmom-svc/api/resources/workorders/${WorkordersJS.currentRow.workorderId}/state/finished`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`,
					'X-PlantId': appsmith.store.PLANT.id
				},
				method: 'PUT',
			},
			name: 'smomSmartmomResourcesWorkordersSatetFinished'
		};

		return fetch(dataRequest.url, dataRequest.config)
			.then(response => {
			return response.json();
		}).then(response => {
			showAlert(TextJS[appsmith.store.LANG].ALERTS.WORKORDER_FINISHED.SUCCESS, 'success')
			return response;
		}).catch(error => {
			console.error(`ERROR ${dataRequest.name} => ${error}`);
			showAlert(TextJS[appsmith.store.LANG].ALERTS.WORKORDER_FINISHED.ERROR, 'error')
		});
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@param organizationUnitId (appsmith.store.STATION_SELECTION.stationId) Get from the store after selecting a station from previous page
	 *	@param workorderId (WorkordersJS.currentRow.id) Get current row
	 *	@api Smom organizationunits views
	 *	@throws Get Production History for a OrganizationUnit and a DateRange
	 *	@private
	*/
	async smomSmartmomViewsOrganizationunitsProductionHistory(workorderId) {
		this.checkIfJWTExist();
		const toDate = moment().format('YYYY-MM-DDTHH:mm:ssZ');
		const fromDate = moment().subtract(60, 'days').format('YYYY-MM-DDTHH:mm:ssZ');
		const params = { fromDate: fromDate, toDate: toDate, workorderId: workorderId };
		const queryString = Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/smartmom-svc/api/views/organizationunits/${appsmith.store.STATION_SELECTION.stationId}/productionhistory?${queryString}`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`,
					'X-PlantId': appsmith.store.PLANT.id
				},
				method: 'GET',
			},
			name: 'smomSmartmomViewsOrganizationunitsProductionHistory'
		};
		return await this.runFetch(dataRequest);
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@param workorderId (WorkordersJS.currentRow.id) Get current row
	 *	@api Smom workorders views
	 *	@throws Get the needed Bom Items for a given Workorder
	 *	@private
	*/
	async smomSmartmomViewsWorkordersBomItems() {
		this.checkIfJWTExist();
		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/smartmom-svc/api/views/workorders/${WorkordersJS.currentRow.workorderId}/bomitems`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`,
					'X-PlantId': appsmith.store.PLANT.id
				},
				method: 'GET',
			},
			name: 'smomSmartmomViewsWorkordersBomItems'
		};
		return await this.runFetch(dataRequest);
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@param workorderId (WorkordersJS.currentRow.id) Get current row
	 *	@api Smom workorders views
	 *	@throws Get the WorkorderView for a WorkorderId
	 *	@private
	*/
	async smomSmartmomViewWorkorders() {
		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/smartmom-svc/api/views/workorders/${WorkordersJS.currentRow.workorderId}`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`,
					'X-PlantId': appsmith.store.PLANT.id
				},
				method: 'GET',
			},
			name: 'smomSmartmomViewWorkorders'
		};
		return await this.runFetch(dataRequest);
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@param quantityPass Get value from the PCM_NEW_Pass_Input field
	 *	@param quantityFail Get value from the PCM_NEW_Rework_Input field
	 *	@param quantityScrap Get value from the PCM_NEW_Scrap_Input field
	 *	@param workorderId Get value from the PartConfirmationModalJS[...].workorderId field from the backend request data (onClickSaveBtn() -> smomSmartmomImportsWorkorderworkstepbookings())
	 *	@param workorderWorstepId Get value from the PartConfirmationModalJS[...].workorderWorkstepId from the backend request data (onClickSaveBtn() -> smomSmartmomImportsWorkorderworkstepbookings())
	 *	@param organizationUnitId Get value from the PartConfirmationModalJS[...].organizationUnitId from the backend request data (onClickSaveBtn() -> smomSmartmomImportsWorkorderworkstepbookings())
	 *	@api Smom workorderworkstepbookings imports
	 *	@throws Import/Load WorkorderWorkstepBooking
	 *	@public
	*/
	async smomSmartmomImportsWorkorderworkstepbookings(quantityPass, quantityFail, quantityScrap, workorderId, workorderWorstepId, organizationUnitId) {
		this.checkIfJWTExist();
		const passForRequest = quantityPass === '0' || quantityPass === '' ? null : { value: `${quantityPass}`, unit: "" };
		const reworkForRequest = quantityFail === '0' || quantityFail === '' ? null : { value: `${quantityFail}`, unit: "" };
		const scrapForRequest = quantityScrap === '0' || quantityScrap === '' ? null : { value: `${quantityScrap}`, unit: "" } ;

		const bodyRequestData = {
			quantityPass: passForRequest,
			quantityFail: reworkForRequest,
			quantityScrap: scrapForRequest,
			workorderId: `${workorderId}`,
			workstepId: `${workorderWorstepId}`,
			organizationUnitId: `${organizationUnitId}`
		}

		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/smartmom-svc/api/imports/workorderworkstepbookings`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`,
					'Content-Type': 'application/json',
					'X-PlantId': appsmith.store.PLANT.id
				},
				method: 'POST',
				body: JSON.stringify(bodyRequestData),
			},
			name: 'smomSmartmomImportsWorkorderworkstepbookings'
		};

		return fetch(dataRequest.url, dataRequest.config)
			.then(response => {
			return response.json();
		}).then(response => {
			showAlert(TextJS[appsmith.store.LANG].ALERTS.PART_CONFIRMATION_SAVE.SUCCESS, 'success')
			return response;
		}).catch(error => {
			console.error(`ERROR ${dataRequest.name} => ${error}`);
			showAlert(TextJS[appsmith.store.LANG].ALERTS.PART_CONFIRMATION_SAVE.ERROR, 'error')
		});

	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *  @param workorderId (WorkordersJS.currentRow.id) Get current row
	 *	@param comment Get text comment from the InputComment field
	 *	@api Smom workorders resources
	 *	@throws Update workorder
	 *	@private
	*/
	async smomSmartmomResourcesWorkordersSetComment(comment) {
		this.checkIfJWTExist();
		const bodyCommentData = {
			payload: `${comment}`
		};

		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/smartmom-svc/api/resources/workorders/${WorkordersJS.currentRow.workorderId}`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`,
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-PlantId': appsmith.store.PLANT.id
				},
				method: 'PUT',
				body: JSON.stringify(bodyCommentData)
			},
			name: 'smomSmartmomResourcesWorkordersSetComment'
		};

		return fetch(dataRequest.url, dataRequest.config)
			.then(response => {
			return response.json();
		}).then(response => {
			showAlert(TextJS[appsmith.store.LANG].ALERTS.WORKORDER_COMMENTED.SUCCESS, 'success')
			return response;
		}).catch(error => {
			console.error(`ERROR ${dataRequest.name} => ${error}`);
			showAlert(TextJS[appsmith.store.LANG].ALERTS.WORKORDER_COMMENTED.ERROR, 'error')
		});
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@param workorderId (WorkordersJS.currentRow.id) Get current row
	 *	@api Documents documentlinks resources
	 *	@throws Get all documents for the given entity id
	 *	@private
	*/
	async smomAttributeResourcesDocumentLinks(workorderId) {
		this.checkIfJWTExist();
		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/attribute-svc/api/resources/documentlinks/${workorderId}`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`,
					'Accept-Language': 'en',
					'X-PlantId': appsmith.store.PLANT.id
				},
				method: 'GET'
			},
			name: 'smomAttributeResourcesDocumentLinks'
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
		this.checkIfJWTExist();
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

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@param workorderId Get view for this workorderId
	 *	@api Smom workorders views
	 *	@throws Get the WorkorderView for a WorkorderId
	 *	@private
	*/
	async smomSmartmomViewWorkordersById(workorderId) {
		this.checkIfJWTExist();
		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/smartmom-svc/api/views/workorders/${workorderId}`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`,
					'X-PlantId': appsmith.store.PLANT.id
				},
				method: 'GET',
			},
			name: 'smomSmartmomViewWorkordersById'
		};
		return await this.runFetch(dataRequest);
	},

	/**
	 *	@param appsmith.store.BASE_SMARTMOM_API_URL Get from store, main url api server
	 *	@param workorderId Get view for this workorderId
	 *  @param state - one of state worksteps (READY, FINISHED, PAUSED...)
	 *	@api Smom worksteps resources
	 *	@throws Get the WorkorderView for a WorkorderId
	 *	@private
	*/
	async smomSmartmomSetWorkstepState(workstepId, state) {
		this.checkIfJWTExist();
		const dataRequest = {
			url: `https://${appsmith.store.BASE_SMARTMOM_API_URL}/smartmom-svc/api/resources/workorderworksteps/${workstepId}/state/${state}`,
			config: {
				headers: {
					Authorization: `Bearer ${appsmith.store.jwt}`,
					'X-PlantId': appsmith.store.PLANT.id
				},
				method: 'PUT',
			},
			name: 'smomSmartmomSetWorkstepState'
		};

		return fetch(dataRequest.url, dataRequest.config)
			.then(response => {
			return response.json();
		}).then(response => {
			showAlert(TextJS[appsmith.store.LANG].ALERTS.WORKSTEP_FINISHED.SUCCESS, 'success')
			return response;
		}).catch(error => {
			console.error(`ERROR ${dataRequest.name} => ${error}`);
			showAlert(TextJS[appsmith.store.LANG].ALERTS.WORKSTEP_FINISHED.ERROR, 'error')
		});
	},


	checkIfJWTExist() {
		if(!appsmith.store.jwt){
			LogoutJS.logout();
		}
	},
}