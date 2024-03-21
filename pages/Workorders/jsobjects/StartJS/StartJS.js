export default {

	async onStart() {
		const code = appsmith.URL.queryParams.code;
		if(code) {
			await this.getToken(code)
		}	
		if(!appsmith.store.LANG) {
			await storeValue('LANG', "en");
		}

		await	RefreshTokenJS.refreshToken();
		await CurrentUserJS.getCurrentUserDataForWorkorders();
		await WorkordersJS.getDataWorkorders();
	},

	async getToken(code) {
		const tokenUrl = ApiJS.urlToken();
		const encodedData = new URLSearchParams({
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: appsmith.store.PAGES['Workorders'].url,
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
				throw new Error(`Workorders page - error: ${response.status}`);
			}
		}).then(async (data) => {
			await storeValue('jwt', data.access_token);
			await storeValue('refresh_jwt', data.refresh_token);
			await storeValue('id_token', data.id_token);
			RefreshTokenJS.refreshToken();
			await CurrentUserJS.getCurrentUserDataForWorkorders();
			await WorkordersJS.getDataWorkorders();
		}).catch(e => console.error('Error on token', e))
	},

}
