{
	let model ={

	}

	let view = {
		el: '.list-wrapper .newSong',
		template: `
			新建歌曲
		`,
		render(){
			$(this.el).html(this.template)
		}
	}

	let controller = {
		model: null,
		view: null,
		init(model,view){
			this.model = model
			this.view = view
			this.view.render()
		}
	}

	controller.init(model,view)

}
