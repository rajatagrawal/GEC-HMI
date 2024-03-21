export default {

	resetButtons() {
		DeactiveWO_BTN1.setColor('#0d9be2'); /* active */
		DeactiveWO_BTN2.setColor('#ffffff'); /* NO active */
		DeactiveWO_BTN3.setColor('#ffffff'); /* NO active */
	},

	async onClickDeactivateBtnInModal() {
		closeModal("WorkorderDeactivateModal");
		WorkordersJS.clearDataTable();
		await this.deactivateWorkorder();
	},

	async deactivateWorkorder() {
		await RefreshTokenJS.resetCounterAndRefreshTokens();
		await ApiJS.smomSmartmomResourcesOrganizationunitsWorkordersWorkorderIdDeactivate();
		WorkordersJS.currentRow = "";
		WorkordersJS.idWorkorder = "";
		WorkordersJS.getDataWorkorders();
	}

}