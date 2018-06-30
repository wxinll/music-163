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
		},
		clearActive(){
			$(this.el).removeClass('active')	
		},
	}

	let controller = {
		model: null,
		view: null,
		init(model,view){
			this.model = model
			this.view = view
			this.view.render()
			this.bindEvents()
			this.bindEventHub()
		},
		bindEvents(){
			$(this.view.el).on('click',(el)=>{
				$(el.currentTarget).addClass('active')
				eventHub.emit('addSong')
			})
		},
		bindEventHub(){
			eventHub.on('selected',()=>{	
				this.view.clearActive()
			})
		}
	}

	controller.init(model,view)

}
