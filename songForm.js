{
	let model = {
		init() {

		},
		data:{
			title:'', 
			singer: '',
			link:'',
			id:'',
		},
		add(data) {
			var Song = AV.Object.extend('songList');
			var songList = new Song();
			return songList.save({
				'title': data.title,
				'singer': data.singer,
				'link': data.link,
			}).then((newInfo) => {
				console.log(data)
				let {id,attributes} = newInfo
				Object.assign(this.data,{id,...attributes})				
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
			}).then((newInfo) => {
				Object.assign(this.data,data)
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
			let placeholders = ['title', 'singer', 'link']
			let html = this.template
			placeholders.map((string) => {
				html = html.replace(`__${string}__`, data[string] || '')
			})
			$(this.el).html(html)
		},//如果没有传入data，则令data={}
		reset(){
			this.render()
			$(this.el).prepend('<h1>新建歌曲</h1>')
		}

	}

	let controller = {
		model: null,
		view: null,
		init(model, view) {
			this.model = model
			this.view = view

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
			let needs = 'title singer link'.split(' ') //array,[title,singer,,]
			let data = {}
			needs.map((str) => {
				data[str] = $(this.view.el).find(`input[name=${str}]`)
					.val()
			})
			// if(data.id){
			// 	this.model.update(data)
			//  window.eventHub.emit('update',data)
			// }else{
			// 	this.model.add(data)
			//  window.eventHub.emit('add',data)
			// }
			this.model.add(data)
		},
		bindEventHub(){
			eventHub.on('addSong',()=>{
				this.view.reset()
			})
			eventHub.on('upLoad',(data)=>{
				this.view.render(data)
			})
		}
	}

	controller.init(model, view)

}