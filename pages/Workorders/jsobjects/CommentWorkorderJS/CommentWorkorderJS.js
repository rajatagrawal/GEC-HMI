export default {

	maximumNumberOfMarks: 120,
	comment: "",
	numberOfMarksRemainingToBeEntered: 0,

	getWorkorderCurrentRowPayload() {
		this.comment = WorkordersJS.currentRow.payload === null ? "" : WorkordersJS.currentRow.payload;
		InputComment.setValue(this.comment);
		this.checkingNumberOfMarksRemainingToBeEntered();
	},

	checkingNumberOfMarksRemainingToBeEntered() {
		this.comment = InputComment.text;
		this.numberOfMarksRemainingToBeEntered = this.maximumNumberOfMarks - this.comment.length;
	},

	async commentWorkorder() {
		await RefreshTokenJS.resetCounterAndRefreshTokens();
		await ApiJS.smomSmartmomResourcesWorkordersSetComment(this.comment);
		await WorkordersJS.getDataWorkorders();
	},

	async onClickCommentBtnInModal() {
		closeModal("WorkorderCommentModal");
		WorkordersJS.clearDataTable();
		await this.commentWorkorder();
	},

}