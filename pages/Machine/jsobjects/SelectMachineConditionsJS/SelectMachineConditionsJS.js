export default {
	conditionList: [],
	machineAllConditionForSelected_MC_Groups: [],
	maxItemsOnPageMachineCondition: 9,
	splittingDataOf_MC_ToShowIntoThreeColumns: [[],[],[]],
	startIndex_MC: 0,
	tmpCounter_MC: 0,
	currentPage_MC: 1,
	allPagesMachineCondition: 1,
	disabledPreviousPage_MC_BTN: true,
	disabledNextPage_MC_BTN: false,
	countOfElementsOnTheLastPage: 0,
	hide_MC_List1: false,
	hide_MC_List2: false,
	hide_MC_List3: false,

	async getMachineConditionListData(conditionGroupId) {
		await RefreshTokenJS.resetCounterAndRefreshTokens();
		const conditionListData = await ApiJS.mdcSmartmomViewConditiongroupsConditionList(conditionGroupId);
		return conditionListData.conditionList;
	},

	async buildListOfMachineConditionsToShow(id) {
		this.conditionList = [];

		this.hide_MC_List1 = false;
		this.hide_MC_List2 = false;
		this.hide_MC_List3 = false;

		this.clearData({
			"startIndex": true,
			"tmpCounter_MC": true,
			"currentPage_MC": true,
			"splittingDataOf_MC": true
		});

		if (MachineConditionsJS.selectedMachineConditionGroups.indexOf(id) !== -1) {
			this.machineAllConditionForSelected_MC_Groups = this.machineAllConditionForSelected_MC_Groups.filter(object => object.conditionGroupId !== id);
			this.refreshMachineConditionView();
		} else {
			Pagination_MC.setVisibility(false);
			const conditionList = await this.getMachineConditionListData(id);
			this.conditionList = conditionList;
			this.machineAllConditionForSelected_MC_Groups = this.machineAllConditionForSelected_MC_Groups.concat(this.conditionList);
			this.refreshMachineConditionView();
		}
		this.countOfElementsOnTheLastPage = this.machineAllConditionForSelected_MC_Groups.length % this.maxItemsOnPageMachineCondition;
	},

	clearData(reset) {
		if (reset.startIndex === true) this.startIndex_MC = 0;
		if (reset.tmpCounter_MC === true) this.tmpCounter_MC = 0;
		if (reset.currentPage_MC === true) this.currentPage_MC = 1;
		if (reset.splittingDataOf_MC === true) this.splittingDataOf_MC_ToShowIntoThreeColumns = [[],[],[]];
	},

	showOrHideOptions() {
		this.allPagesMachineCondition = Math.ceil(this.machineAllConditionForSelected_MC_Groups.length / this.maxItemsOnPageMachineCondition);
		this.enabledOrDisablePreviousPage_MC_BTN();
		this.enabledOrDisableNextPage_MC_BTN();
		this.showOrHidePaginationHeaderContent_MC()
		this.showOrHideNextAndPreviousButtons_MC();
	},

	showOrHidePaginationHeaderContent_MC() {
		if(this.machineAllConditionForSelected_MC_Groups.length > 0) {
			Pagination_MC.setVisibility(true);
			MC_Content.setVisibility(true);
			MC_Header.setVisibility(true);
		} else {
			Pagination_MC.setVisibility(false);
			MC_Content.setVisibility(false);
			MC_Header.setVisibility(false);
		}
	},

	showOrHideNextAndPreviousButtons_MC() {
		if(this.machineAllConditionForSelected_MC_Groups.length > this.maxItemsOnPageMachineCondition) {
			MC_ArrowLeft.setVisibility(true);
			MC_ArrowRight.setVisibility(true);
		} else {
			MC_ArrowLeft.setVisibility(false);
			MC_ArrowRight.setVisibility(false);
		}
	},

	enabledOrDisablePreviousPage_MC_BTN() {
		if(this.currentPage_MC === 1) {
			this.disabledPreviousPage_MC_BTN = true;
		} else {
			this.disabledPreviousPage_MC_BTN = false;
		}
	},

	enabledOrDisableNextPage_MC_BTN() {
		if(this.currentPage_MC === this.allPagesMachineCondition) {
			this.disabledNextPage_MC_BTN = true;
		} else {
			this.disabledNextPage_MC_BTN = false;
		}
	},

	refreshMachineConditionView() {
		this.showOrHideOptions();
		this.hide_MC_Lists();
		for(let i = 0; i < this.maxItemsOnPageMachineCondition; i++) {
			if(this.machineAllConditionForSelected_MC_Groups.length === this.startIndex_MC) {
				ProgressbarForRequestDataJS.showOrHide(false);
				return;
			}
			this.splittingDataOf_MC_ToShowIntoThreeColumns[this.tmpCounter_MC].push(this.machineAllConditionForSelected_MC_Groups[this.startIndex_MC]);

			this.startIndex_MC++;
			this.tmpCounter_MC === 2 ? this.tmpCounter_MC = 0 : this.tmpCounter_MC++;
		}
	},

	hide_MC_Lists() {
		if (this.allPagesMachineCondition === this.currentPage_MC) {
			if ((this.machineAllConditionForSelected_MC_Groups.length % this.maxItemsOnPageMachineCondition) === 1) {
				this.hide_MC_List1 = true;
				this.hide_MC_List2 = false;
				this.hide_MC_List3 = false;
			} else if ((this.machineAllConditionForSelected_MC_Groups.length % this.maxItemsOnPageMachineCondition) === 2) {
				this.hide_MC_List1 = true;
				this.hide_MC_List2 = true;
				this.hide_MC_List3 = false;
			} else if ((this.machineAllConditionForSelected_MC_Groups.length % this.maxItemsOnPageMachineCondition) >= 3 || (this.machineAllConditionForSelected_MC_Groups.length % this.maxItemsOnPageMachineCondition) === 0) {
				this.hide_MC_List1 = true;
				this.hide_MC_List2 = true;
				this.hide_MC_List3 = true;
			}
		} else {
			this.hide_MC_List1 = true;
			this.hide_MC_List2 = true;
			this.hide_MC_List3 = true;
		}
	},

	nextMachineConditionPage() {
		this.clearData({
			"startIndex": false,
			"tmpCounter_MC": false,
			"currentPage_MC": false,
			"splittingDataOf_MC": true
		});
		this.currentPage_MC++;
		this.enabledOrDisablePreviousPage_MC_BTN();
		this.refreshMachineConditionView();
	},

	previousMachineConditionPage() {
		this.clearData({
			"startIndex": false,
			"tmpCounter_MC": true,
			"currentPage_MC": false,
			"splittingDataOf_MC": true
		});
		this.enabledOrDisablePreviousPage_MC_BTN();

		let calculatedInitialIndexForPreviousPage = 0;
		if (this.currentPage_MC === this.allPagesMachineCondition && this.countOfElementsOnTheLastPage != 0) {
			if (this.countOfElementsOnTheLastPage != 0) {
				calculatedInitialIndexForPreviousPage = this.maxItemsOnPageMachineCondition + this.countOfElementsOnTheLastPage;
			} else {
				calculatedInitialIndexForPreviousPage = 2 * this.maxItemsOnPageMachineCondition;
			}
			this.startIndex_MC -= calculatedInitialIndexForPreviousPage;
		} else {
			calculatedInitialIndexForPreviousPage = 2 * this.maxItemsOnPageMachineCondition;
			this.startIndex_MC -= calculatedInitialIndexForPreviousPage;
		}

		this.currentPage_MC--;
		this.enabledOrDisablePreviousPage_MC_BTN();
		this.refreshMachineConditionView();
	},

	async onClickSelectMachineCondition(currentItem) {
		Selected_MC_ModalJS.checkingNumberOfMarksRemainingToBeEntered();
		showModal('SelectedMachineConditionModal');
		await storeValue('SELECTED_MACHINE_CONDITION', currentItem);
	}

}