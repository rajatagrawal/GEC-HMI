export default {

	setupList: [],
	isPausePrev: false,
	isFinishPrev: false,
	countOfColumnsWorksteps: 25,

	resetAllStates () {
		this.isFinishPrev = false;
		this.isPausePrev = false;
	},

	setIsFinishPrevTrue () {
		this.isFinishPrev = true;
		this.isPausePrev = false;
	},

	setIsPausePrevTrue () {
		this.isFinishPrev = false;
		this.isPausePrev = true;
	},

	getStatesDisabled(workstepId, buttonState) {
		const currentWorkstep = this.setupList.find(workstep => workstep.id === workstepId);
		switch(buttonState){
			case 'PAUSED':
				return currentWorkstep.state === buttonState || currentWorkstep.state === 'STARTED' || currentWorkstep.state === 'READY';
			default:
				return currentWorkstep.state === buttonState || currentWorkstep.state === 'STARTED';
		}
	},

	async getWorkstepsForWorkorder (workorderId = WorkordersJS.idWorkorder) {
		await RefreshTokenJS.resetCounterAndRefreshTokens();
		const getViewWorkorders = await ApiJS.smomSmartmomViewWorkordersById(workorderId);
		this.setupList = getViewWorkorders.workorderWorkstepViewList.map(i => i.workorderWorkstep);
	},

	async onClickStopWorksteps (workstepId) {
		await ApiJS.smomSmartmomSetWorkstepState(workstepId, 'PAUSED');
	},

	async onClickFinishWorksteps (workstepId) {
		await ApiJS.smomSmartmomSetWorkstepState(workstepId, 'FINISHED');
	},

	async onClickReadyWorksteps (workstepId) {
		await ApiJS.smomSmartmomSetWorkstepState(workstepId, 'READY');
	},

	async setStopAllWorkstepsTable (workorderId) {
		const getWorkorders = await ApiJS.smomSmartmomViewWorkordersById(workorderId);
		getWorkorders.workorderWorkstepViewList.map(i => i.workorderWorkstep).forEach((workstep) => {
			if (workstep.state === 'READY') {
				this.onClickFinishWorksteps(workstep.id);
			}
			this.onClickStopWorksteps(workstep.id);
		});
	},

	async setFinishAllWorkstepsTable (workorderId) {
		const getWorkorders = await ApiJS.smomSmartmomViewWorkordersById(workorderId);
		getWorkorders.workorderWorkstepViewList.map(i => i.workorderWorkstep).forEach((workstep) => {
			this.onClickFinishWorksteps(workstep.id);
		});
	},

	async checkIsFinishedAllWorksteps() {
		return this.setupList.some(workstep => workstep.state !== 'FINISHED' &&  workstep.state !== 'STARTED');
	},
}