export default {

	partConfirmationData: [],
	element: {},
	passForRequest: "",
	reworkForRequest: "",
	scrapForRequest: "",
	formError: false,
	msgError: "",
	passValue: 0,
	failValue: 0,
	scrapValue: 0,

	async getPartConfirmationData() {
		this.clearFields();
		ProgressBarsJS.partConfirmationData(true, false);
		await RefreshTokenJS.resetCounterAndRefreshTokens();
		const partConfirmationData = await ApiJS.smomSmartmomViewWorkorders();
		this.partConfirmationData = partConfirmationData;
		this.searchItem();
		ProgressBarsJS.partConfirmationData(false, true);
	},

	searchItem() {
		let data = this.partConfirmationData.workorderWorkstepViewList;
		let targetId = appsmith.store.STATION_SELECTION.stationId;

		for (let item of data) {
			for (let unit of item.workorderWorkstepOrganizationUnits) {
				if (unit.organizationUnitId === targetId) {
					this.element = unit;
					this.checkDate(this.element.startDate);
					this.getPassInputValue(this.element.quantityPass);
					this.getReworkInputValue(this.element.quantityFail);
					this.getScrapInputValue(this.element.quantityScrap);
					break;
				}
			}
		}
	},

	clearFields() {
		PCM_NEW_Pass_Input.setValue(0);
		PCM_NEW_Rework_Input.setValue(0);
		PCM_NEW_Scrap_Input.setValue(0);
		this.passValue = 0;
		this.failValue = 0;
		this.scrapValue = 0;
	},

	parseDate(date) {
		return moment(date).format('DD.MM.YYYY');
	},

	checkDate(date) {
		this.formError = false;
		this.msgError = TextJS[appsmith.store.LANG].PART_CONFIRMATION_MODAL.ERROR;
		if(date === null) {
			this.formError = true;
		}
		return this.formError;
	},

	getPassInputValue(quantityPass) {
		this.passValue = !quantityPass ? 0 : quantityPass.value;
	},

	getReworkInputValue(quantityFail) {
		this.failValue = !quantityFail ? 0 : quantityFail.value;
	},

	getScrapInputValue(quantityScrap) {
		const scrapValue = !quantityScrap ? 0 : quantityScrap.value;
		this.scrapValue = scrapValue;
	},

	isValid() {
		if(this.element.startDate !== null) {
			if (!PCM_NEW_Pass_Input.isValid || !PCM_NEW_Rework_Input.isValid || !PCM_NEW_Scrap_Input.isValid) {
				this.formError = true;
				this.msgError = TextJS[appsmith.store.LANG].PART_CONFIRMATION_MODAL.ERROR_FORM;
			} else {
				this.formError = false;
				this.msgError = "";
			}
		}
	},

	calculateOpenValue() {
		const targetValue = this.partConfirmationData.workorder.quantity.value ? this.partConfirmationData.workorder.quantity.value : 0;
		const quantityPassValue = this.element.quantityPass ? this.element.quantityPass.value : 0;
		return `${targetValue} / ${targetValue - quantityPassValue}`;
	},

	async onClickSaveBtn() {
		await ApiJS.smomSmartmomImportsWorkorderworkstepbookings(PCM_NEW_Pass_Input.text, PCM_NEW_Rework_Input.text, PCM_NEW_Scrap_Input.text, this.element.workorderId, this.element.workorderWorkstepId, this.element.organizationUnitId);
		this.getPartConfirmationData();
		this.clearFields()
		closeModal('PartConfirmationModal');
	},

	passValueToShow() {
		return ` (${this.passValue})`;
	},

	failValueToShow() {
		return ` (${this.failValue})`;
	},

	scrapValueToShow() {
		return ` (${this.scrapValue})`;
	}

}