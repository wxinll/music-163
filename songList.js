{
	let model = {
		init: function() {
			var APP_ID = 'CT338hB7nwI3r9G9dT3KvNOo-gzGzoHsz'
			var APP_KEY = 'SAw1gdes6KEz0C5m4hn0GJKb'
			AV.init({
				appId: APP_ID,
				appKey: APP_KEY
			})
		},
		fetch: function() {
			var query = new AV.Query('songList')
			return query.find()
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
		loadList() {
			this.model.fetch().then((objects) => {
				objects.forEach((value) => {
					let name = value.attributes.name
					let content = value.attributes.content
					let li = document.createElement('li')
					li.textContent = `${name}:${content}`
					let messagesLi = document.querySelector('.messages ol')
					messagesLi.appendChild(li)
				})
			}, function(error) {
				// 异常处理
			})
		}
		
	}
	controller.init(model,view)
}

	var controller = {
		model: null,
		view: null,
		init:function(model,view){
			this.view = view
			this.model = model
			this.model.init()
			this.loadList()
			this.bindEvents()
		},

		loadList: function() {

		},
		saveMessage: function() {
			let name = this.view.querySelector('input[name=name]').value
			let content = this.view.querySelector('input[name=content]').value
			this.model.save(name, content).then( (objects)=> {
				let li = document.createElement('li')
				li.textContent = `${name}:${content}`
				let messagesLi = this.view.querySelector('ol')
				messagesLi.appendChild(li)
			})
		},
		bindEvents: function() {
			($('.messages form')).on('submit', (e) => {
				e.preventDefault()
				this.saveMessage()
				this.view.querySelector('input[name=name]').value = ''
				this.view.querySelector('input[name=content]').value = ''
			})
		}
	}
