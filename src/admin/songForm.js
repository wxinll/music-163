{
	let model = {
		data : {
			title: '',
			singer: '',
			link: '',
			lyrics: '',
			id: '',
		},
		init() {
			this.data = {
				title: '',
				singer: '',
				link: '',
				lyrics: '',
				id: '',
			}
		},
		add(data) {
			var Song = AV.Object.extend('songList');
			var songList = new Song();
			return songList.save({
				'title': data.title,
				'singer': data.singer,
				'link': data.link,
				'lyrics': data.lyrics,
			}).then((newInfo) => {
				let {id,attributes} = newInfo
				Object.assign(this.data,{id,...attributes})	
				//data {title,...}	
				window.eventHub.emit('edit',{...attributes})
				window.eventHub.emit('addSong')
			}, () => {
				console.log('error')
			})
		},
		update(data) {
			var songList = AV.Object.createWithoutData('songList', data.id)
			return songList.save({
				'title': data.title,
				'singer': data.singer,
				'link': data.link,
				'lyrics': data.lyrics
			}).then((newInfo) => {
				let {id,attributes} = newInfo
				Object.assign(this.data,{id,...attributes})
				//data {id,...}
				window.eventHub.emit('edit',{id,...attributes})
			}, () => {
				console.log('error')
			})			
		}
	}

	let view = {
		el: '.songInfo-wrapper>.songInfo',
		template: `
			<form autocomplete="off">
				<div class="row" for="title">
					<label for="title">歌曲标题</label>
					<input id="title" type="text" value="__title__">
				</div>
				<div class="row">
					<label for="singer">歌手</label>
					<input id="singer" type="text" value="__singer__">
				</div>
				<div class="row">
					<label for="link">歌曲外链</label>
					<input id="link" type="text" value="__link__">
				</div>
				<div class="row">
					<label for="lyrics">歌词</label>
					<textarea id="lyrics" cols="80" rows="10">__lyrics__</textarea>
				</div>
				<div class="row action">
					<button type="submit" class="new">
						<a href="#" class="set_1_btn Vbtn-3">
							<svg>
								<rect x="0" y="0" fill="none" width="100%" height="100%"></rect>
							</svg> 保 存
						</a>
					 </button>
				</div>
			</form>
		`,
		render(data = {}) {
			let placeholders = ['title', 'singer', 'link', 'lyrics']
			let html = this.template
			placeholders.map((string) => {
				html = html.replace(`__${string}__`, data[string] || '')
			})
			$(this.el).html(html)
			if(data.id){
				$(this.el).prepend('<h1>编辑歌曲</h1>')
			}else{
				$(this.el).prepend('<h1>新建歌曲</h1>')				
			}
		},//如果没有传入data，则令data={}
		reset(){
			this.render()
		}

	}

	let controller = {
		model: null,
		view: null,
		init(model, view) {
			this.model = model
			this.view = view
			this.model.init()

			this.view.render()
			this.bindEvents()
			this.bindEventHub()
		},
		bindEvents() {
			$(this.view.el).on('submit','form', (e) => {
				e.preventDefault()
				this.save()
			})
		},
		save() {
			let needs = 'title singer link lyrics'.split(' ') //array,[title,singer,,]
			let song = {}
			song.id = this.model.data.id
			needs.map((str) => {
				song[str] = $(this.view.el).find(`[id=${str}]`)
					.val()
			})
			if(song.title){
				if (song.id) {
					this.model.update(song)
					window.eventHub.emit('update', song)
				} else {
					this.model.add(song)
				}
			}
		},
		bindEventHub(){
			eventHub.on('addSong',()=>{
				if(this.model.data.id){
					this.model.init()
				}
				this.view.render(this.model.data)	
			})
			eventHub.on('upLoadSuccess',(data)=>{
				window.eventHub.emit('addSong')
				this.view.render(data) //{title,link}
				Object.assign(this.model.data,data)
			})
			eventHub.on('selected',(data)=>{
				this.view.render(data)//{allInfo}
				Object.assign(this.model.data,data)
			})
		}
	}

	controller.init(model, view)

}