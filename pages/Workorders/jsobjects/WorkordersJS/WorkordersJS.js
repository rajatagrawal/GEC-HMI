export default {
	currentRow: "",
	idWorkorder: "",
	workorderWorkstepId: "",
	workorders: [],
	workorderProductionHistory: [],
	activatedWorkorder: [],
	queryParams: {},
	setupList: [],
	quantityPass: 0,
	quantityFail: 0,
	quantityScrap: 0,
	firstElement: {},

	async getDataWorkorders () {
		if (appsmith.store.WORKORDER && appsmith.store.WORKORDER.nameActivatedWorkorder) {
			await storeValue('WORKORDER', {
				...appsmith.store.WORKORDER, 
				nameActivatedWorkorder: "" 
			});
		}
		ProgressBarsJS.quantities(true, false);
		ProgressBarsJS.workordersRequestData(true);
		await RefreshTokenJS.resetCounterAndRefreshTokens();
		const workorders = await ApiJS.smomSmartmomViewOrganizationunitsWorkorders();

		const uniqueWorkorders = [];
		workorders.forEach(order => {
			if(!uniqueWorkorders.find(item => item.workorderId === order.workorderId)){
				uniqueWorkorders.push(order);
			}
		});
		this.workorders = uniqueWorkorders;
		this.queryParams = appsmith.URL.queryParams;
		if (this.workorders.length === 0) {
			showAlert(`${TextJS[appsmith.store.LANG].DOES_NOT_WORKORDERS}`, 'warning');
			ProgressBarsJS.workordersRequestData(false);
			ProgressBarsJS.documentLinks(false, true);
			ProgressBarsJS.quantities(false, true);
			await CurrentUserJS.getCurrentUserDataForWorkorders();
			return;
		}
		CurrentUserJS.getUserNameAndPlantToShowForWorkorders();
		await this.updateWorkordersData();
		ProgressBarsJS.workordersRequestData(false);
		if (this.workorders && (this.workorders.length > 0)) {
			this.currentRow = TableWorkorders.selectedRow;
			await this.onClickRow();
			setInterval(async () => {
				await this.onRowSelected(false);
			},5000);
			await PartConfirmationModalJS.getPartConfirmationData();
		}
	},

	async onClickRow() {
		ProgressBarsJS.quantities(true, false);
		await this.onRowSelected();
		await DocumentsTabJS.loadDocumentLinks();
	},

	async onRowSelected(refresh = true) {
		if (refresh){
			await RefreshTokenJS.resetCounterAndRefreshTokens();
		}
		this.loadProductionHistory();
		if (this.workorderProductionHistory.length <= 0) {
			this.quantityPass = 0;
			this.quantityFail = 0;
			this.quantityScrap = 0;
			return;
		}
		this.firstElement = this.workorderProductionHistory[0];
		this.quantityPass = !this.firstElement.quantityPass.value ? 0 : this.firstElement.quantityPass.value;
		this.quantityFail = !this.firstElement.quantityFail.value ? 0 : this.firstElement.quantityFail.value;
		this.quantityScrap = !this.firstElement.quantityScrap.value ? 0 : this.firstElement.quantityScrap.value;
	},

	async loadProductionHistory() {
		ProgressBarsJS.quantities(false, true);
		if (TableWorkorders.selectedRow.workorderId){
			const workorderProductionHistory = await ApiJS.smomSmartmomViewsOrganizationunitsProductionHistory(TableWorkorders.selectedRow.workorderId);
			this.workorderProductionHistory = workorderProductionHistory;
			ProgressBarsJS.quantities(false, true);
		}
	},

	async updateWorkordersData() {
		const activatedWorkorder = this.workorders.find(item => item.activated === true);
		this.activatedWorkorder = activatedWorkorder;
		const preparedWorkordersData = await this.setActivatedWorkorder(activatedWorkorder, this.workorders);
		this.insertWorkordersDataInTable(preparedWorkordersData);
	},

	insertWorkordersDataInTable(paramData) {
		if(paramData.length === 0) {
			ProgressBarsJS.quantities(false, true);
		}
		TableWorkorders.setData(paramData);
	},

	async setActivatedWorkorder(successData, paramData) {
		if (successData) {
			this.workorderWorkstepId = successData.workorderWorkstepId;
			this.idWorkorder = successData.workorderId;
			const foundObject = paramData.find(item => item.workorderId === successData.workorderId);
			if (foundObject) {
				const index = paramData.findIndex(item => item.workorderId === successData.workorderId);
				if (index !== -1) {
					paramData.splice(index, 1);
				}
				paramData.unshift(foundObject);
			}
		}

		await storeValue('WORKORDER', {
			...appsmith.store.WORKORDER, 
			nameActivatedWorkorder: this.activatedWorkorder ? paramData[0].workorderName : "" 
		});
		TopBar_ActivatedWorkorder_AWI.setVisibility(true);
		return paramData;
	},

	parseStartTime(startTime) {
		if(!startTime) {
			return "";
		}
		const date = moment(startTime);
		const dateComponent = date.utc().format('YYYY/MM/DD');
		const timeComponent = date.utc().format('HH:mm:ss');
		return dateComponent + " " + timeComponent;
	},

	clearDataTable() {
		TableWorkorders.setData([]);
	},

}