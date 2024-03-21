export default {

	maximumNumberOfMarks: 200,
	comment: "",
	numberOfMarksRemainingToBeEntered: 0,
	currentDateAndTime: "",
	organizationUnitConditionId: "",
	maxDate: "",
	msgError: "",

	async onLoadModal() {
		this.maximumNumberOfMarks = 200;
		this.comment = "";
		this.numberOfMarksRemainingToBeEntered = this.maximumNumberOfMarks - this.comment.length;
		Selected_MC_InputComment.setValue(this.comment);
		Selected_MC_Switch.setValue(false);
		Selected_MC_DatePicker.setValue(moment().tz('Europe/Warsaw').format('YYYY-MM-DDTHH:mm:ss'));
		this.maxDate = moment().tz('Europe/Warsaw').format('YYYY-MM-DDTHH:mm:ss');
		await this.checkSwitchForTheLine();
		this.msgError = `${TextJS[appsmith.store.LANG].SELECTED_MACHINE_CONDITION_MODAL.ERROR_FORM} - ${TextJS[appsmith.store.LANG].SELECTED_MACHINE_CONDITION_MODAL.REQUIRED_FIELD}`;
		this.isDatePickerEmpty();
	},


	checkingNumberOfMarksRemainingToBeEntered() {
		this.comment = Selected_MC_InputComment.text;
		this.numberOfMarksRemainingToBeEntered = this.maximumNumberOfMarks - this.comment.length;
	},

	setVisibilityMsgError(show) {
		SMCM_Msg_Error.setVisibility(show);
	},

	isDatePickerEmpty() {
		if (Selected_MC_DatePicker.selectedDate !== "") {
			this.setVisibilityMsgError(false);
			SetCondition_BTN.setDisabled(false);
		} else {
			this.setVisibilityMsgError(true);
			SetCondition_BTN.setDisabled(true);
		}
	},

	checkSwitchForTheLine() {
		if (Selected_MC_Switch.isSwitchedOn) {
			this.organizationUnitConditionId = appsmith.store.STATION_SELECTION.lineId;
		} else {
			this.organizationUnitConditionId = appsmith.store.STATION_SELECTION.stationId;
		}
	},

	onChangeSwitchForTheLine() {
		this.checkSwitchForTheLine();
	},

	async onClickSetConditionBtn() {
		let parseBookDate = moment(Selected_MC_DatePicker.formattedDate).format('YYYY-MM-DDTHH:mm:ssZ');
		await RefreshTokenJS.resetCounterAndRefreshTokens();
		await ApiJS.mdcSmartmomResourcesOrganizationUnitsConditions(parseBookDate, this.organizationUnitConditionId, this.comment);
		closeModal('SelectedMachineConditionModal');
	}

}