window.eventHub = {
	fnList: {
		selected: [],
		active: [],
		newSong: [],
	},
	emit(name,data) {
		for (let key in this.fnList) {
			if (name === key) {
				this.fnList[key].map((fn) => {
					fn.call(undefined,data)
				})
			}
		}
	},
	on(name, fn) {
		if (this.fnList[name] === undefined) {
			this.fnList[name] = []
		}
		this.fnList[name].push(fn)
	}
}