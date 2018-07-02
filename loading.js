{
	let view = {
		el: '#loading-wrapper',
		show(){
			$(this.el).addClass('active')
		},
		hidden(){
			$(this.el).removeClass('active')
		}
	}

	let controller = {
		view: null,
		init(){
			this.view = view
			this.bindEventHub()
		},
		bindEventHub(){
			window.eventHub.on('beforeUpload',()=>{
				this.view.show()
			})
			window.eventHub.on('upLoadSuccess',()=>{
				this.view.hidden()
			})
		}
	}

	controller.init(view)
}