export default {

	queryParams: {},
	setupList: [],

	async getBomItemsDataForCurrentWorkorders () {
		DownloadSetupListPdfFile.setVisibility(false);
		ProgressBarsJS.setupList(true, false);
		await RefreshTokenJS.resetCounterAndRefreshTokens()
		const setupList = await ApiJS.smomSmartmomViewsWorkordersBomItems();
		this.setupList = setupList;
		this.queryParams = appsmith.URL.queryParams;
		DownloadSetupListPdfFile.setVisibility(true);
		ProgressBarsJS.setupList(false, true);
	},

}