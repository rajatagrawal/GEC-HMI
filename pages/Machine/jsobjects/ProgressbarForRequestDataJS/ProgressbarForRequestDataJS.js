export default {

	showOrHide(visibleProgress) {
		if(visibleProgress) {
			showModal("Preloader");
			return;
		}
		closeModal("Preloader");
	}

}