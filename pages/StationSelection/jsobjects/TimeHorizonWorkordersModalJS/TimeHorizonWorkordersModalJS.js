export default {

	formError: false,
	msgError: "",
	msgErrorToTooltip: "",

	setDefaulValue() {
		this.formError = false;
		this.msgError = "";
		this.msgErrorToTooltip = "";
		THM_toDateInHours_Value.setValue(appsmith.store.WORKORDERS_PERIOD_OF_TIME.hoursAhead);
	},

	isValid() {
		if (!THM_toDateInHours_Value.isValid) {
			if (THM_toDateInHours_Value.text === "0") {
				this.formError = true;
				this.msgError = TextJS[appsmith.store.LANG].TIME_HORIZON_FOR_WORKORDERS_MODAL.ERROR_FORM
				this.msgErrorToTooltip = TextJS[appsmith.store.LANG].TIME_HORIZON_FOR_WORKORDERS_MODAL.ERROR_VALUE_EQUAL_ZERO;
			} else if (THM_toDateInHours_Value.text[0] === '0') {
				this.formError = true;
				this.msgError = TextJS[appsmith.store.LANG].TIME_HORIZON_FOR_WORKORDERS_MODAL.ERROR_FORM
				this.msgErrorToTooltip = TextJS[appsmith.store.LANG].TIME_HORIZON_FOR_WORKORDERS_MODAL.ERROR_VALUE_START_ZERO;
			}	else {
				this.formError = true;
				this.msgError = TextJS[appsmith.store.LANG].TIME_HORIZON_FOR_WORKORDERS_MODAL.ERROR_FORM;
				this.msgErrorToTooltip = TextJS[appsmith.store.LANG].TIME_HORIZON_FOR_WORKORDERS_MODAL.ERROR_INCORRECT_FORMAT;
			}
		} else {
			if(THM_toDateInHours_Value.value.length === 0) {
				this.formError = true;
				this.msgError = `${TextJS[appsmith.store.LANG].TIME_HORIZON_FOR_WORKORDERS_MODAL.ERROR_FORM} - ${TextJS[appsmith.store.LANG].TIME_HORIZON_FOR_WORKORDERS_MODAL.REQUIRED_FIELD}`;
				this.msgErrorToTooltip = TextJS[appsmith.store.LANG].TIME_HORIZON_FOR_WORKORDERS_MODAL.REQUIRED_FIELD;
			} else {
				this.formError = false;
				this.msgError = "";
				this.msgErrorToTooltip = "";
			}
		}
	},

	async onClickSave() {
		closeModal("TimeHorizonForWorkorders");
		showAlert(`${TextJS[appsmith.store.LANG].ALERTS.TIME_HORIZON_CHANGE.SUCCESS}`, 'success');
		await storeValue('WORKORDERS_PERIOD_OF_TIME', WorkordersPeriodOfTime.setNewPeriodOfTime(THM_toDateInHours_Value.text));
	},

}