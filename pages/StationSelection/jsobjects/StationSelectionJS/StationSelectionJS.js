export default {

	stations: [],
	stationsGroup: [],
	optionsToSelectLine: [],
	defaultOptionToSelectLine: undefined,
	optionsToSelectStationGroup: [],
	defaultOptionToSelectStationGroup: undefined,
	disableStationGroupSelectField: false,
	dataListToDisplay: [],
	defaultValueToSelectLine: "",

	async prepareOptionsToSelectLine() {
		ProgressbarForRequestDataJS.showOrHide(true);
		await RefreshTokenJS.resetCounterAndRefreshTokens();
		const optionsToSelectLine = await ApiJS.smomSmartmomResourcesOrganizationunits();
		this.optionsToSelectLine = optionsToSelectLine;
		WorkordersPeriodOfTime.setDefaultPeriodOfTime();
		ProgressbarForRequestDataJS.showOrHide(false);
		const lineOption = this.optionsToSelectLine.find(({id}) => id === appsmith.store.STATION_SELECTION?.lineId ?? '')

		if(lineOption?.id) {
			this.defaultOptionToSelectLine = lineOption;
			this.defaultValueToSelectLine = this.defaultOptionToSelectLine?.id ?? "";
			await this.onClickSelectField(lineOption.id, "line")
		}

		const stationsGroupOption = this.optionsToSelectStationGroup.find(({id}) => id === appsmith.store.STATION_SELECTION?.stationsGroupId ?? '')

		if(stationsGroupOption?.id) {
			this.defaultOptionToSelectStationGroup = stationsGroupOption			
			await this.onClickSelectField(stationsGroupOption.id, "stationsGroup")
		}
	},

	async onClickSelectField(selectedItem, selectOfType) {
		ProgressbarForRequestDataJS.showOrHide(true);
		await RefreshTokenJS.resetCounterAndRefreshTokens();
		const data = await ApiJS.smomMasterdataViewsOrganizationunitsOrganizationunitIdTreeChilds(selectedItem);

		switch (selectOfType) {
			case "line":
				this.stations = [];
				SelectStationGroupOptions.setSelectedOption("");
				this.disableStationGroupSelectField = false;
				this.stations = data;
				this.stationsGroup = [];
				this.optionsToSelectStationGroup = [];
				if(this.stations.apiCallHash === 'null' && this.stations.failure === "URL_NOT_FOUND") {
					this.stations = [];
				}
				await this.prepareOptionsToStationGroup();
				break;
			case "stationsGroup":
				this.stationsGroup = [];
				this.stationsGroup = data;
				if(this.stationsGroup.apiCallHash === 'null' && this.stationsGroup.failure === "URL_NOT_FOUND") {
					this.stationsGroup = [];
				} else {
					this.stationsGroup.forEach((item) => (item.stationsGroup = true));
				}
				break;
		}

		this.dataListToDisplay = this.stations.concat(this.stationsGroup);
		ProgressbarForRequestDataJS.showOrHide(false);
	},


	async prepareOptionsToStationGroup() {
		if(this.stations.apiCallHash === 'null' && this.stations.failure === "URL_NOT_FOUND") {
			return;
		}

		this.disableStationGroupSelectField = this.stations.some((item) => item.type === "STATIONGROUP");

		if(!this.disableStationGroupSelectField) {
			return;
		}

		for (let i = 0; i < this.stations.length; i++) {
			if (this.stations[i].type === "STATIONGROUP") {
				this.optionsToSelectStationGroup.push(this.stations.splice(i, 1)[0]);
				i--;
			}
		}
	},

	nameStationGroup(currentItem) {
		return currentItem.stationsGroup ? SelectStationGroupOptions.selectedOptionLabel : "";
	},

	async onStationClick() {
		await storeValue('STATION_SELECTION', {
			stationName: StationsList.selectedItem.name,
			stationDescription: StationsList.selectedItem.description,
			stationId: StationsList.selectedItem.id,
			lineName: SelectLineOptions.selectedOptionLabel,
			lineId: SelectLineOptions.selectedOptionValue,
			stationsGroupId: SelectStationGroupOptions.selectedOptionValue
		});

		navigateTo('Workorders');
	}

}