export default {

	dataSetupListToDisplay: [],

	async getDataSetupList() {
		DownloadSetupListPdfFile.setVisibility(false);
		ProgressbarForRequestDataJS.showOrHide(true);
		await RefreshTokenJS.resetCounterAndRefreshTokens();
		const dataSetupListToDisplay = await ApiJS.smomSmartmomResourcesWorkordersBomItems();
		this.dataSetupListToDisplay = dataSetupListToDisplay.filter(u => u.materialPart !== undefined);
		DownloadSetupListPdfFile.setVisibility(true);
		ProgressbarForRequestDataJS.showOrHide(false);
	},

}