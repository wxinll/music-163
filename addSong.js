{
	let model ={

	}

	let view = {
		el: '.list-wrapper .newSong',
		template: `
			<span>新建歌曲</span>
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
				eventHub.emit('addSong')
			})
		},
		bindEventHub(){
			eventHub.on('selected',()=>{	
				this.view.clearActive()
			})
			eventHub.on('addSong',()=>{
				$(this.view.el).addClass('active')
			})
		}
	}

	controller.init(model,view)

}
