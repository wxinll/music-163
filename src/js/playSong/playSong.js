{
	let view = {
		el: '#app',
		init() {
			this.$el = $(this.el)
		},
		render(data) {
			let song = data.song
			let status = data.status
			if (this.$el.find('audio').attr('src') !== song.link) {
				let audio = this.$el.find('audio')
					.attr('src', song.link)
					.get(0)
			}
			if(status === 'play'){
				this.$el.find('.song-disc')
					.addClass('active')
			}else if(status === 'paused'){
				this.$el.find('.song-disc')
					.removeClass('active')
			}
		},
		play() {
			this.$el.find('audio')[0].play()
		},
		pause() {
			this.$el.find('audio')[0].pause()
		}
	}
	let model = {
		data: {
			song: {
				id: '',
				title: '',
				singer: '',
				link: '',
			},
			status: 'play',
		},
		get(id){
			var query = new AV.Query('songList')
			return query.get(id).then((song) => {
				Object.assign(this.data.song, {
					id: song.id,
					...song.attributes
				})
				return song
			})
		},
	}

	let controller = {
		view: null,
		model: null,
		init() {
			this.view = view
			this.view.init()
			this.model = model
			let id = this.returnId()
			this.model.get(id).then(()=>{
				this.view.render(this.model.data)
			})
			this.bindEvents()
			this.setVolume()
		},
		returnId() {
			let search = window.location.search
			if (search.indexOf('?') === 0) {
				search = search.substring(1)
			}

			let array = search.split('&').filter((v => v))
			let id = ''

			for (let i = 0; i < array.length; i++) {
				let kv = array[i].split('=')
				let key = kv[0]
				let value = kv[1]
				if (key === 'id') {
					id = value
					break
				}
			}

			return id
		},
		bindEvents(){
			this.view.$el.find('.song-disc')
				.on('click',()=>{
					if(this.model.data.status === 'paused'){
						this.model.data.status = 'play'
						this.view.play()
					}else if(this.model.data.status === 'play'){
						this.model.data.status = 'paused'
						this.view.pause()
					}
					this.view.render(this.model.data)
				})
		},
		setVolume(){
			this.view.$el.find('audio')[0].volume = 0.2
			this.view.$el.find('audio')[0].autoplay = true
		}

	}
	controller.init(view, model)
}