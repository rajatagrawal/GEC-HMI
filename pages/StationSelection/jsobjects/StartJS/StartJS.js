export default {

	async onStart() {
		const code = appsmith.URL.queryParams.code;

		if(code) {
			await this.getToken(code)
		}	
		if(!appsmith.store.LANG) {
			await storeValue('LANG', "en");
		}

		if(appsmith.store.PROFILE === 'dev' || (appsmith.store.PROFILE === 'prod' && code === undefined)) {
			await this.runInitRequests()
		}
	},

	getToken(code) {
		const tokenUrl = ApiJS.urlToken();
		const encodedData = new URLSearchParams({
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: appsmith.store.PAGES['StationSelection'].url,
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
			if (response.status === 200) {
				return response.json();
			} else {
				throw new Error(`StationSelection page - error: ${response.status}`);
			}
		}).then(async (data) => {
			await storeValue('jwt', data.access_token);
			await storeValue('refresh_jwt', data.refresh_token);
			await storeValue('id_token', data.id_token);
			await this.runInitRequests();
		}).catch(e => console.error('Error on token', e))
	},

	async runInitRequests() {
		
		await RefreshTokenJS.refreshToken();
		await CurrentUserJS.getCurrentUserData()
		RefreshDateAndTimeJS.refreshDateAndTime()
		await StationSelectionJS.prepareOptionsToSelectLine()
	}

}
