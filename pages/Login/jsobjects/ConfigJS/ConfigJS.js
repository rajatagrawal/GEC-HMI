export default {
	DEFAULT: {
		BASE_KEYCLOAK_URL: "keycloak.apps.dev.aws.alm.oncite.io",
		BASE_SMARTMOM_API_URL: "smartmom.apps.dev.aws.alm.oncite.io",
		KEYCLOAK_CLIENT_ID: "smartmom",
		PROFILE: "dev",
		APPSMITH_PAGE_ENDING: "/edit?branch=main", // "/edit?branch=BRANCH_NAME"
		TOKEN_CLIENT_ID: "94e68ad50b754a87a20e96ce10106c89",
		TOKEN_CLIENT_SECRET: "611f5c8bb40E437Eb1FC9707559A8Dc0",
		URL_EXTERNAL_DOCUMENT: "https://appsmith-test.apps.dev.aws.alm.oncite.io/index.html"
	},

	async onStart () {
		await storeValue('COMPILATION_VERSION', VersionJS.COMPILATION_VERSION);
		await ConfigApi.run()
			.then(async data => await this.storeConfigValues(data)).catch(error => {
			console.error(error)
			this.storeConfigValues(this.DEFAULT)
		}).finally(async () => {
			const profile = appsmith.URL.queryParams.profile
			if(['dev', 'prod'].includes(profile)) {
				console.log('PROFILE', profile)
				await storeValue('PROFILE', profile);
			}
			await this.mapPages();
			await this.handleRedirect();
		})
	},

	async storeConfigValues(data) {
		for (let [key, value] of Object.entries(data)) {
			console.log(key, value);
			await storeValue(key, value);
		}
	},

	async handleRedirect() {		
		let redirectUrl = ``
		if (appsmith.store.STATION_SELECTION && appsmith.store.STATION_SELECTION.lineId) {
			redirectUrl = `https://${appsmith.store.BASE_KEYCLOAK_URL}/auth/realms/oncite-dps/protocol/openid-connect/auth?scope=openid&response_type=code&client_id=${appsmith.store.KEYCLOAK_CLIENT_ID}&redirect_uri=${encodeURIComponent(appsmith.store.PAGES['Workorders'].url)}`
		} else {
			redirectUrl = `https://${appsmith.store.BASE_KEYCLOAK_URL}/auth/realms/oncite-dps/protocol/openid-connect/auth?scope=openid&response_type=code&client_id=${appsmith.store.KEYCLOAK_CLIENT_ID}&redirect_uri=${encodeURIComponent(appsmith.store.PAGES['StationSelection'].url)}`
		}

		await storeValue('KEYCLOAK_REDIRECT_URL_FULL', redirectUrl)
		console.log(redirectUrl)

		// Don't delete if condition
		if(appsmith.store.PROFILE === 'prod') {
			navigateTo(redirectUrl)
		}
	},

	parseTime(time) {
		if(!time) {
			return "";
		}
		const date = new Date(time).toLocaleString();
		return date;
	},

	async mapPages() {
		try{
			// get appsmith.APPSMITH_APP_ID
			const r1 = await fetch(`${appsmith.URL.protocol}//${appsmith.URL.host}/api/v1/pages?pageId=${appsmith.URL.pathname.split('/')[3].split('-')[1]}&mode=PUBLISHED`)
			const d1 = await r1.json()
			await storeValue('APPSMITH_APP_ID', d1.data.application.id)

			// get appsmith.PAGES
			const r2 = await fetch(`${appsmith.URL.protocol}//${appsmith.URL.host}/api/v1/pages?applicationId=${appsmith.store.APPSMITH_APP_ID}&mode=PUBLISHED`)
			const d2 = await r2.json()
			const baseUrl = `${appsmith.URL.protocol}//${appsmith.URL.host}${appsmith.URL.pathname.split('/').slice(0, 3).join('/')}`
			const pages = d2.data.pages.reduce((acc, {id, slug, name}) => {
				acc[name] = { id, slug, name,
										 url: `${baseUrl}/${slug}-${id}${appsmith.store.APPSMITH_PAGE_ENDING}`
										};
				return acc;
			}, {});
			await storeValue('PAGES', pages);
			const getDataAndTimeLastDeployedOrModifiedAt = (d2.data.application.lastDeployedAt === undefined || d2.data.application.lastDeployedAt === "") ? d2.data.application.modifiedAt : d2.data.application.lastDeployedAt
			const parseDataAndTimeLastDeployedOrModifiedAt = this.parseTime(getDataAndTimeLastDeployedOrModifiedAt);
			await storeValue('DATA_AND_TIME_LAST_DEPLOYED_OR_MODIFIED_AT', parseDataAndTimeLastDeployedOrModifiedAt);
		} catch(error){
			console.error(`e`, error)
		}
	}

}