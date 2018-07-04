{
	let view = {
		el: 'section>nav.tabs-nav',
		$el: null,
		init(){
			this.$el = $(this.el)
		} 
	}
	let controller={
		view: null,
		init(view){
			this.view = view
			this.view.init()
			this.bindEvents()
			this.bindEventHub()
		},
		bindEvents(){
			this.view.$el.on('click','li',(e)=>{
				$(e.currentTarget).addClass('active')
					.siblings()
					.removeClass('active')
			})
		},
		bindEventHub(){
			this.view.$el.on('click','li',(e)=>{
				let tabName = $(e.currentTarget)
					.find('div')
					.attr('data-tab-name')
				window.eventHub.emit('selectTab',tabName)
			})
		}
	}
	controller.init(view)
}