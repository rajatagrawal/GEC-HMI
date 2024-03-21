export default {

	isActivateWorkorder(idWork) {
		return WorkordersJS.idWorkorder === idWork;
	},

	resetButtons() {
		ActiveWO_BTN1.setColor('#0d9be2'); /* active */
		ActiveWO_BTN2.setColor('#ffffff'); /* NO active */
		ActiveWO_BTN3.setColor('#ffffff'); /* NO active */
	},

	async onClickActivateBtnInModal() {
		ProgressBarsJS.quantities(true, false);
		if (SetupWorkstepTableJS.isFinishPrev) {
			await SetupWorkstepTableJS.getWorkstepsForWorkorder(WorkordersJS.idWorkorder);
			const isFinished = await SetupWorkstepTableJS.checkIsFinishedAllWorksteps();	
			closeModal("WorkorderActivateModal");
			if (isFinished) {
				showModal("SetupWorkstepsModal");
				SetupWorkstepTableJS.resetAllStates();
			} else {
				WorkordersJS.clearDataTable();
				this.activateWorkorder();	
			}
		} else {
			closeModal("WorkorderActivateModal");
			WorkordersJS.clearDataTable();
			this.activateWorkorder();	
		}
	},

	async activateWorkorder() {
		if (!WorkordersJS.currentRow.workorderId) {
			return;
		}
		await RefreshTokenJS.resetCounterAndRefreshTokens();
		await ApiJS.smomSmartmomResourcesOrganizationunitsWorkordersWorkorderIdActivate();
		WorkordersJS.getDataWorkorders();
	},

}