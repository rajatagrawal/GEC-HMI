export default {

	currentDateAndTime: "",
	expiresTimeJwt: appsmith.store.expires_time_jwt, 
	refreshExpiresTimeJwt: appsmith.store.refresh_expires_time_jwt,

	loadDateAndTimeForWorkorders() {
		this.currentDateAndTime = GetDateAndTimeJS.getCurrentDateAndTime(); // clock in the operator information container
		this.logoutUserWithoutActivityAfterRefreshTokenExpires();
		this.tokenRefreshsAfterExpiresTimeJwt();
	},

	refreshDateAndTime() {
		this.loadDateAndTimeForWorkorders();
		setInterval(() => {
			this.loadDateAndTimeForWorkorders();
		}, 1000);
	},

	tokenRefreshsAfterExpiresTimeJwt() {
		const endTime = moment();
		const activeDuration = moment.duration(endTime.diff(RefreshTokenJS.startTokenTime)).asSeconds();
		if(activeDuration >= this.expiresTimeJwt * 0.5) {
			RefreshTokenJS.startTokenTime = moment();
			RefreshTokenJS.refreshToken();
		}
	},

	logoutUserWithoutActivityAfterRefreshTokenExpires() {
		const endTime = moment();
		const duration = moment.duration(endTime.diff(RefreshTokenJS.startExpiresTokenJwt)).asSeconds();
		if (this.refreshExpiresTimeJwt <= duration) {
			LogoutJS.logout();
			navigateTo('Login');
		}
	},
}