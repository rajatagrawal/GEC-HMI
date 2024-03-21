export default {

	languageList: [
		{
			id: "en",
			name: TextJS[appsmith.store.LANG].SYSTEM_INFORMATION_MODAL.LANG.EN
		},
		{
			id: "de",
			name: TextJS[appsmith.store.LANG].SYSTEM_INFORMATION_MODAL.LANG.DE
		},
		{
			id: "it",
			name: TextJS[appsmith.store.LANG].SYSTEM_INFORMATION_MODAL.LANG.IT
		}
	],

	defaultSelectedValue() {
		SelectLang_SI_Modal.setSelectedOption(appsmith.store.LANG);
	},

	async onLangChange() {
		if(!SelectLang_SI_Modal.selectedOptionValue) {
			return;
		}
		await this.setLangToStore(SelectLang_SI_Modal.selectedOptionValue);
		this.clearDataAfterChangedLang();
		await ApiJS.smomAttributeResourcesConfigvaluesUpdate(appsmith.store.USER.name, SelectLang_SI_Modal.selectedOptionValue);
		this.refreshLanguageForTranslations();
	},

	refreshLanguageForTranslations() {
		let newTextLang;
		this.languageList = this.languageList.map((obj) => {
			switch(obj.id) {
				case "en":
					newTextLang = TextJS[appsmith.store.LANG].SYSTEM_INFORMATION_MODAL.LANG.EN
					break;
				case "de":
					newTextLang = TextJS[appsmith.store.LANG].SYSTEM_INFORMATION_MODAL.LANG.DE
					break;
				case "it":
					newTextLang = TextJS[appsmith.store.LANG].SYSTEM_INFORMATION_MODAL.LANG.IT
					break;
			}
			return {...obj, name: newTextLang};
		});
	},

	async setLangToStore(langId) {
		await storeValue('LANG', langId);
	},

	clearDataAfterChangedLang() {
		showAlert(TextJS[appsmith.store.LANG].ALERTS.LANG_CHANGE.SUCCESS, 'success');
		closeModal('SystemInformation');
	},

}