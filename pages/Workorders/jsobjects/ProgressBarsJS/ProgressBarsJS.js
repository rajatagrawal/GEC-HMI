export default {

	partConfirmationData(visibleProgress, visibleValues) {
		ProgressBarForPartConfirmation.setVisibility(visibleProgress);
		PCM_ContainerOfInputs.setVisibility(visibleValues);
		PCM_ContainerOfSaveBtnAndErr.setVisibility(visibleValues);
		PCM_ContainerOfTargetAndScrap.setVisibility(visibleValues);
		PCM_ContainerOfDateOrderDesc.setVisibility(visibleValues);
	},

	quantities(visibleProgress, visibleValues) {
		ProgressQuantities.setVisibility(visibleProgress);
		QuantitiesData.setVisibility(visibleValues);
	},

	workordersRequestData(visibleProgress) {
		if(visibleProgress) {
			showModal("Preloader");
			return;
		}
		closeModal("Preloader");
	},

	setupList(visibleProgress, visibleValues) {
		ProgressBarSetupList.setVisibility(visibleProgress);
		SetupList.setVisibility(visibleValues)
	},

	documentLinks(visibleProgress, visibleValues) {
		ProgressBar_DL_Container.setVisibility(visibleProgress);
		DocumentLinksList.setVisibility(visibleValues);
	},

}