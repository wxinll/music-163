{	
	let view = {
		el: '#app',
		init() {
			this.$el = $(this.el)
		},
		render(data){
			let {song,status} = data
			let {lyrics} = song
			if (this.$el.find('audio').attr('src') !== song.link) {

				this.$el.find('.song-info>h2').text(song.title)

				let audio = this.$el.find('audio')
					.attr('src', song.link)
					.get(0)

				audio.ontimeupdate = ()=>{
					this.showLyrics(audio.currentTime)
				}

				this.addLyrics(lyrics)
			}
			if(status === 'play'){
				this.$el.find('.song-disc')
					.addClass('active')
			}else if(status === 'paused'){
				let child = this.$el.find('.songCover')[0]
				let parent = this.$el.find('.rotate-wrap')[0]
				let childTransform = getComputedStyle(child).transform
				let parentTransform = getComputedStyle(parent).transform
				parent.style.transform = (parentTransform === 'none') ? childTransform : childTransform.concat(' ', parentTransform)
				this.$el.find('.song-disc')
					.removeClass('active')
			}
		},
		addLyrics(lyrics){
			lyrics.split('\n').map((string)=>{
				let p = document.createElement('p')
				let regex = /\[([\d:.]+)\](.+)/
				let matches = string.match(regex)
				if(matches){
					p.textContent = matches[2]
					let time = matches[1]
					let parts = time.split(':')
					let minutes = parts[0]
					let seconds = parts[1]
					let newTime = parseInt(minutes,10) * 60 + parseFloat(seconds,10)
					p.setAttribute('data-time',newTime)
				}else{
					p.textContent = string
				}
				this.$el.find('.lyrics>.slide').append(p)
			})
		},
		play() {
			this.$el.find('audio')[0].play()
		},
		pause() {
			this.$el.find('audio')[0].pause()
		},
		initAudio(){
			this.$el.find('audio')[0].volume = 0.2
			this.$el.find('audio')[0].autoplay = true
		},
		showLyrics(time){
			let pArray = this.$el.find('.lyrics>.slide>p')
			let p
			let initalTime = pArray.eq(0).attr('data-time')
			for(let i=0;i<pArray.length;i++){
				if( time > initalTime){
					if(i + 1 === pArray.length){
						p = pArray[i]
						break
					}
					if(i + 1 < pArray.length){
						let currentTime = pArray.eq(i).attr('data-time')
						let nextTime = pArray.eq(i+1).attr('data-time')
						if(currentTime <= time && time < nextTime){
							p = pArray[i]
							break
						}
					}
				}else{
					p = pArray[0]
				}
			}
			$(p).addClass('active')
				.siblings('.active')
				.removeClass('active')

			let $slide = this.$el.find('.lyrics>.slide')
			let a = p.getBoundingClientRect().top
			let b = $slide[0].getBoundingClientRect().top
			let distance = a - b -25
			$slide.css({
				transform: `translateY(${- distance }px)`
			})
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
		getSong(id){
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
			this.model.getSong(id).then(()=>{
				this.view.render(this.model.data)
				this.view.initAudio()
			})
			this.bindEvents()
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
			this.view.$el.on('click','.song-disc',(e)=>{
					if(this.model.data.status === 'paused'){
						this.model.data.status = 'play'
						this.view.play()
					}else if(this.model.data.status === 'play'){
						this.model.data.status = 'paused'
						this.view.pause()
					}
					this.view.render(this.model.data)
				})
			this.view.$el.find('audio')[0].addEventListener('ended',()=>{
				this.model.data.status = 'paused'
				this.view.render(this.model.data)
			},true)
		},
	}
	
	controller.init(view, model)
}