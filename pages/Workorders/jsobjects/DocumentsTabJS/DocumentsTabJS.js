export default {

	maxTextLength: 50,
	workorderDocumentLinks: [],

	async loadDocumentLinks() {
		ProgressBarsJS.documentLinks(true, false);
		await RefreshTokenJS.resetCounterAndRefreshTokens()
		const workorderDocumentLinks = await ApiJS.smomAttributeResourcesDocumentLinks(TableWorkorders.selectedRow.workorderId);
		this.workorderDocumentLinks = workorderDocumentLinks;
		ProgressBarsJS.documentLinks(false, true);
	},

	async onClickReloadDocumentLinks() {
		await RefreshTokenJS.resetCounterAndRefreshTokens();
		this.loadDocumentLinks();
	},

	async onClickItemOfDocumentsList(currentItem) {
		ProgressBarsJS.documentLinks(true, false);
		if (!currentItem.documentMimeType) {
			let data = {
				c: appsmith.store.TOKEN_CLIENT_ID,
				cs: appsmith.store.TOKEN_CLIENT_SECRET,
				u: currentItem.url
			}
			const params = encodeURIComponent(JSON.stringify(data));
			navigateTo(appsmith.store.URL_EXTERNAL_DOCUMENT, {params}, 'NEW_WINDOW');
			ProgressBarsJS.documentLinks(false, true);
			return;
		}
		const urlTransactionDataDocumentPreview = ApiJS.urlTransactionDataDocumentPreview(currentItem.documentId);
		navigateTo(`${urlTransactionDataDocumentPreview}`, {}, 'NEW_WINDOW');
		ProgressBarsJS.documentLinks(false, true);
	},

	truncateText(text) {
		if (text.length >= this.maxTextLength) {
			return `${text.slice(0, this.maxTextLength)}...`;
		}
		return text;
	},

}