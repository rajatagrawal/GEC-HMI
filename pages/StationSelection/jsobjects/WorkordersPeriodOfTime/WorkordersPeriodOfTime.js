export default {

	periodOfTime: {
		toDate: "",
		hoursAhead: ""
	},

	async setDefaultPeriodOfTime() {
		if (!appsmith.store.WORKORDERS_PERIOD_OF_TIME) {
			const defaultHoursAhead = "24";
			this.periodOfTime = {
				toDate: moment().add(defaultHoursAhead, 'hours').format('YYYY-MM-DDTHH:mm:ssZ'),
				hoursAhead: defaultHoursAhead
			};
			await storeValue('WORKORDERS_PERIOD_OF_TIME', this.periodOfTime);
		}
	},

	setNewPeriodOfTime(hoursAhead) {
		return {
			toDate: moment().add(hoursAhead, 'hours').format('YYYY-MM-DDTHH:mm:ssZ'),
			hoursAhead: hoursAhead
		}
	}

}