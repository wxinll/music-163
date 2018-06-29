{
	let model = {
		init: function() {

		},
		fetch: function() {
			var query = new AV.Query('songList')
			return query.find().then((objects) => {
				objects.forEach((value) => {
					console.log({1:value})
				})
			}, function(error) {
				// 异常处理
			})
		},
		save: function(name, content) {
			var Songlist = AV.Object.extend('songList');
			var songList = new Songlist();
			return songList.save({
				'title': name,
				'singer': content,
				'link': null,
			})
		},
	}

	let view = {
		el: '.list-wrapper .songList-wrapper',
		template: `
			<ul class="songList">
				<li>音乐名字</li>
				<li>音乐名字</li>
				<li>音乐名字</li>
				<li>音乐名字</li>
				<li>音乐名字</li>
				<li>音乐名字</li>
				<li>音乐名字</li>
				<li>音乐名字</li>
				<li>音乐名字</li>
				<li>音乐名字</li>
				<li>音乐名字</li>
				<li>音乐名字</li>
				<li>音乐名字</li>
				<li>音乐名字</li>
				<li>音乐名字</li>
				<li>音乐名字</li>
				<li>音乐名字</li>
				<li>音乐名字</li>	
			</ul>
		`,
		render() {
			$(this.el).html(this.template)
		}
	}

	let controller = {
		model: null,
		view: null,
		init() {
			this.model = model
			this.view = view

			this.model.init()
			this.view.render()

		},
		bindEvents(){

		}
		
	}
	controller.init(model,view)
}