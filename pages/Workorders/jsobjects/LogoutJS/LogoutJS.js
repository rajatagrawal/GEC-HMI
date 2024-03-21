export default {

	reset() {
		storeValue('jwt', undefined);
		storeValue('refresh_jwt', undefined);
		storeValue('expires_time_jwt', undefined);
		storeValue('refresh_expires_time_jwt', undefined);
	},

	async logout() {
		showAlert(TextJS[appsmith.store.LANG].SUCCESS_LOGOUT, "success");
		this.reset();

		// Don't delete if condition
		if(appsmith.store.PROFILE === 'prod') {
			const redirectUrl = `https://${appsmith.store.BASE_KEYCLOAK_URL}/auth/realms/oncite-dps/protocol/openid-connect/logout?id_token_hint=${appsmith.store.id_token}&post_logout_redirect_uri=${encodeURIComponent(appsmith.store.PAGES['Login'].url)}`
			console.log(redirectUrl)
			navigateTo(redirectUrl)
		}

		if(appsmith.store.PROFILE === 'dev') {
			navigateTo('Login')
		}
	},

}