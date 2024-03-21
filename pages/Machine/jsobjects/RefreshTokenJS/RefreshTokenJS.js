export default {
	startTokenTime: 0,
	startExpiresTokenJwt: 0,

	async refreshToken() {
		const tokensData = await ApiJS.refreshToken();
		await storeValue('jwt', tokensData.access_token);
		await storeValue('refresh_jwt', tokensData.refresh_token);
		await storeValue('expires_time_jwt', tokensData.expires_in-5);
		await storeValue('refresh_expires_time_jwt', tokensData.refresh_expires_in-5);
	},

	resetCounter() {
		this.startTokenTime = moment();
		this.startExpiresTokenJwt = moment();
	},

	async resetCounterAndRefreshTokens() {
		const endTime = moment();
		const duration = moment.duration(endTime.diff(this.startTokenTime)).asSeconds();
		if (duration >= RefreshDateAndTimeJS.expiresTimeJwt * 0.5 ) {
			this.resetCounter();
			await RefreshTokenJS.refreshToken();
		}
		this.startExpiresTokenJwt = moment();
	}

}
