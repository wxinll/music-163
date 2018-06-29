{
	let model = {
		init() {

		},
		save(data) {
			var Song = AV.Object.extend('songList');
			var songList = new Song();
			return songList.save({
				'title': data.title,
				'singer': data.singer,
				'link': data.link,
			}).then((success) => {
				console.log(success)
			}, () => {
				console.log('error')
			})
		},
	}

	let view = {
		el: '.songInfo-wrapper>.songInfo',
		template: `
			<h1>歌曲信息</h1>
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
		render(data) {
			let placeholders = ['title', 'singer', 'link']
			let html = this.template
			placeholders.map((string) => {
				html = html.replace(`__${string}__`, data[string] || '')
			})
			$(this.el).html(html)
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
		},
		bindEvents() {
			$(this.el).find('button[type=submit]').on('submit', (e) => {
				e.preventDefault()
				this.save()
			})
		},
		save() {
			let needs = 'name singer url'.split(' ')
			let data = {}
			needs.map((str) => {
				data[str] = $(this.view).find(`input[name=${str}]`)
					.val()
			})
			this.model.save(data)
		},
	}

	controller.init(model, view)

}