{
	let model = {
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
				window.eventHub.emit('edit',{id,...attributes})
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
				<div class="row">
					<label>歌曲标题</label>
					<input name="title" type="text" value="__title__">
				</div>
				<div class="row">
					<label>歌手</label>
					<input name="singer" type="text" value="__singer__">
				</div>
				<div class="row">
					<label>歌曲外链</label>
					<input name="link" type="text" value="__link__">
				</div>
				<div class="row">
					<label>歌词</label>
					<textarea name="lyrics" id="" cols="100" rows="10"></textarea>
				</div>
				<div class="row action">
					<button type="submit">保存</button>
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
				console.log('this.model.data.id')
				console.log(this.model.data.id)
			})
		},
		save() {
			let needs = 'title singer link lyrics'.split(' ') //array,[title,singer,,]
			let song = {}
			song.id = this.model.data.id
			needs.map((str) => {
				song[str] = $(this.view.el).find(`input[name=${str}]`)
					.val()
			})
			if (song.id) {
				this.model.update(song)
				window.eventHub.emit('update', song)
			} else {
				this.model.add(song)
			}
		},
		bindEventHub(){
			eventHub.on('addSong',(data)=>{
				this.model.init()
				this.view.render() //{}render空数据
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