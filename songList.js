{
	let model = {
		data: {
			id:'',
			title: '',
			singer: '',
			link: '',
		},
		init: function() {

		},
		find: function() {
			var query = new AV.Query('songList')
			return query.find().then((objects) => {
				//objects=array[r,r,r,r]
				//r={attributes{},id}
				objects.map((r)=>{
					let {id,attributes} = r
					data = {id,...attributes}
					console.log(data)
				})
			})
		},
	}

	let view = {
		el: '.list-wrapper .songList-wrapper',
		template: `
			<ul class="songList">
				<li>音乐名字</li>
				<li>音乐名字</li>	
			</ul>
		`,
		render(data) {
			$(this.el).html(this.template)
			let li = document.createElement('li')
			$(li).attr('data-song-id',data.id)
				.appendTo(this.el.find())
		},
		addActive() {

		},
		clearActive(){
			$(this.el).find('.active')
				.removeClass('active')
		}
	}

	let controller = {
		model: null,
		view: null,
		init() {
			this.model = model
			this.view = view

			// this.model.init()
			this.model.find()
			this.view.render()
			this.bindEvents()
			this.bindEventHub()
		},
		bindEvents() {
			$(this.view.el).on('click', 'li', (el) => {
				$(el.currentTarget).addClass('active')
					.siblings('.active')
					.removeClass('active')
				window.eventHub.emit('selected')
			})
		},
		bindEventHub(){
			eventHub.on('addSong',()=>{
				this.view.clearActive()
			})
		},
	}

	controller.init(model, view)
}