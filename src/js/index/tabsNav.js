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
		},
		bindEvents(){
			this.view.$el.on('click','li',(e)=>{
				$(e.currentTarget).addClass('active')
					.siblings()
					.removeClass('active')
			})
		}
	}
	controller.init(view)
}