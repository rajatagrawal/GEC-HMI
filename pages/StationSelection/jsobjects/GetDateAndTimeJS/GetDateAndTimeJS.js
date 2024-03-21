export default {
	
	getCurrentDate() {
		return moment().format("DD/MM/YYYY");
	},
	
	getCurrentTime() {
		return moment().format("HH:mm:ss");
	},
	
	getCurrentDateAndTime() {
		return `${this.getCurrentDate()} ${this.getCurrentTime()}`;
	}

}
