export default {
	
	resetButtons() {
		FinishWO_BTN1.setColor('#0d9be2'); /* active */
		FinishWO_BTN2.setColor('#ffffff'); /* NO active */
	},
	
	onClickFinishBtnInModal() {
		closeModal("WorkorderFinishModal");
		WorkordersJS.clearDataTable();
		this.finishWorkorder();
	},
	
	async finishWorkorder() {
		await RefreshTokenJS.resetCounterAndRefreshTokens();
		await ApiJS.smomSmartmomResourcesWorkordersSatetFinished();
		WorkordersJS.getDataWorkorders();
	},
	
}