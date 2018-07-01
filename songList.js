{
	let model = {
		data: {
			songs: null,
		},
		init: function() {
			this.find()
		},
		find: function() {
			var query = new AV.Query('songList')
			return query.find().then((objects) => {
				//objects=array[r,r,r,r...]
				//r={attributes{},id}
				return this.data.songs = objects.map((r)=>{
					let {id,attributes} = r
					return {id,...attributes}
				})//array[{id,...attributes},date2...]
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
			let songs = data.songs
			let ul = $(this.el).find('ul')
			songs.map((obj)=>{
				let li = document.createElement('li')
				$(li).text(obj.title).attr('data-song-id',obj.id)
					.appendTo(ul)
			})
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
			this.model.init()
			this.view = view

			console.log('this.model.data')
			console.log(this.model.data)

			console.log('this.model.data.songs')
			console.log(this.model.data.songs)

			console.log('var test = this.model.data')
			console.log('test.songs')
			var test = this.model.data
			console.log(test.songs)

			// this.view.render(this.model.data)
			// this.bindEvents()
			// this.bindEventHub()
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