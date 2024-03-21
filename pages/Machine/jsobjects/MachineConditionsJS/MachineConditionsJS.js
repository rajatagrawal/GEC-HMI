export default {
	allConditionGroups: [],
	conditionGroupsToShow: [],
	currentPage_MCG: 1,
	startIndex_MCG: 0,
	disabledPreviousPage_MCG_BTN: true,
	disabledNextPage_MCG_BTN: false,
	selectedMachineConditionGroups: [],
	conditionGroups: [],
	bgSelectedMachineConditionGroups: '#383838',
	splittingDataOf_MCG_ToShowIntoThreeColumns: [[],[],[]],
	allPagesMachineConditionGroups: 1,
	maxItemsOnPageMachineConditionGroups: 6,
	block_MCG_Btn: false,
	hide_MCG_List1: false,
	hide_MCG_List2: false,
	hide_MCG_List3: false,

	async getMachineAllConditionGroupsData() {
		Pagination_MCG.setVisibility(false);
		ProgressbarForRequestDataJS.showOrHide(true);
		const conditionGroups = await ApiJS.mdcSmartmomViewConditiongroups();
		this.conditionGroups = conditionGroups;
		this.allPagesMachineConditionGroups = Math.ceil(this.conditionGroups.length / this.maxItemsOnPageMachineConditionGroups) === 0 ? 1 : Math.ceil(this.conditionGroups.length / this.maxItemsOnPageMachineConditionGroups);
		this.conditionGroups.filter((item) => {
			this.allConditionGroups.push(item.conditionGroup);
		});
		if(this.allConditionGroups.length > this.maxItemsOnPageMachineConditionGroups) {
			MCG_ArrowLeft.setVisibility(true);
			MCG_ArrowRight.setVisibility(true);
		}
		this.allConditionGroupsSplitedIntoThreeColumns();
		ProgressbarForRequestDataJS.showOrHide(false);
		Pagination_MCG.setVisibility(true);
	},

	allConditionGroupsSplitedIntoThreeColumns() {
		this.hide_MCG_List1 = false;
		this.hide_MCG_List2 = false;
		this.hide_MCG_List3 = false;
		this.hide_MCG_Lists();

		if(this.allConditionGroups.length > this.startIndex_MCG) {
			this.disabledNextPage_MCG_BTN = false;
		}

		let tmpCounter_MCG = 0;
		for(let i = 0; i < this.maxItemsOnPageMachineConditionGroups; i++) {
			if(this.allConditionGroups.length === this.startIndex_MCG) {
				this.disabledNextPage_MCG_BTN = true;
				return;
			}
			this.conditionGroupsToShow.push([this.allConditionGroups[this.startIndex_MCG]]);

			this.splittingDataOf_MCG_ToShowIntoThreeColumns[tmpCounter_MCG].push(this.allConditionGroups[this.startIndex_MCG]);
			this.startIndex_MCG++;
			tmpCounter_MCG === 2 ? tmpCounter_MCG = 0 : tmpCounter_MCG++;
		}

		if(this.allConditionGroups.length === this.startIndex_MCG) {
			this.disabledNextPage_MCG_BTN = true;
			return;
		}
	},

	hide_MCG_Lists() {
		if (this.allPagesMachineConditionGroups === this.currentPage_MCG) {
			if ((this.allConditionGroups.length % this.maxItemsOnPageMachineConditionGroups) === 1) {
				this.hide_MCG_List1 = true;
				this.hide_MCG_List2 = false;
				this.hide_MCG_List3 = false;
			} else if ((this.allConditionGroups.length % this.maxItemsOnPageMachineConditionGroups) === 2) {
				this.hide_MCG_List1 = true;
				this.hide_MCG_List2 = true;
				this.hide_MCG_List3 = false;
			} else if ((this.allConditionGroups.length % this.maxItemsOnPageMachineConditionGroups) >= 3 || (this.allConditionGroups.length % this.maxItemsOnPageMachineConditionGroups) === 0) {
				this.hide_MCG_List1 = true;
				this.hide_MCG_List2 = true;
				this.hide_MCG_List3 = true;
			}
		} else {
			this.hide_MCG_List1 = true;
			this.hide_MCG_List2 = true;
			this.hide_MCG_List3 = true;
		}
	},

	nextMachineConditionGroupsPage() {
		this.splittingDataOf_MCG_ToShowIntoThreeColumns = [[],[],[]];
		this.conditionGroupsToShow = [];
		this.currentPage_MCG++;
		this.enabledPreviousPage_MCG_BTN();
		this.allConditionGroupsSplitedIntoThreeColumns();
	},

	previousMachineConditionGroupsPage() {
		this.splittingDataOf_MCG_ToShowIntoThreeColumns = [[],[],[]];
		let conditionGroupsToShowLength = this.conditionGroupsToShow.length;
		this.conditionGroupsToShow = [];
		this.currentPage_MCG--;
		this.startIndex_MCG -= (this.maxItemsOnPageMachineConditionGroups + conditionGroupsToShowLength);
		this.enabledPreviousPage_MCG_BTN();
		this.allConditionGroupsSplitedIntoThreeColumns();
	},

	enabledPreviousPage_MCG_BTN() {
		if(this.currentPage_MCG === 1) {
			this.disabledPreviousPage_MCG_BTN = true;
		} else {
			this.disabledPreviousPage_MCG_BTN = false;
		}
	},

	async onClickMachineConditionGroup(id) {
		if (!this.block_MCG_Btn) {
			this.block_MCG_Btn = true;
			this.setBgSelected_MCG(id);
			ProgressbarForRequestDataJS.showOrHide(true);
			await SelectMachineConditionsJS.buildListOfMachineConditionsToShow(id);
			this.saveOrRemoveClickedMachineConditionGroup(id);
			ProgressbarForRequestDataJS.showOrHide(false);
			this.block_MCG_Btn = false;
		}
	},

	saveOrRemoveClickedMachineConditionGroup(id) {
		this.selectedMachineConditionGroups.indexOf(id) !== -1 ? this.selectedMachineConditionGroups.splice(this.selectedMachineConditionGroups.indexOf(id), 1) : this.selectedMachineConditionGroups.push(id);
	},

	setBgSelected_MCG(id) {
		return this.selectedMachineConditionGroups.includes(id) ? '#0d9be2' : '#383838';
	},

	convertColorFromRgbaToHex(colorRGB) {
		return `#${((1 << 24) + (colorRGB.red << 16) + (colorRGB.green << 8) + colorRGB.blue).toString(16).slice(1)}`;
	},
}
