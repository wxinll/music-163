{
	let view = {
		el: 'section>nav.tabs-nav',
		$el: null,
		init(){
			this.$el = $(this.el)
		} 
	}
	let model = {
		tabName: '',
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
				this.PageSwitch(e)
			})
		},
		PageSwitch(e){//switch page-1 page-2 page-3
			let tabName = $(e.currentTarget)
				.find('div')
				.attr('data-tab-name')
			$(`.tab-content .${tabName}`).addClass('active')
				.siblings().removeClass('active')
		}
	}
	controller.init(view)
}