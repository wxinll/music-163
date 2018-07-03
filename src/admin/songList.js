{
	let model = {
		data: {
			songs: [],
		},
		init: function() {

		},
		find: function() {
			var query = new AV.Query('songList')
			return query.find().then((objects) => {
				//objects=array[r,r,r,r...]
				//r={attributes{},id}
				return this.data.songs = objects.map((r)=>{
					let {id,attributes} = r
					return {id,...attributes}
				})//array[{id,...attributes},date2...]，异步操作，所有代码执行完才能返回到数据
			})
		},
	}

	let view = {
		el: '.list-wrapper .songList-wrapper',
		template: `
			<ul class="songList">	
			</ul>
		`,
		render(data={}) {
			$(this.el).html(this.template)

			if(JSON.stringify(data) !== '{}'){
				let songs = data.songs
				let ul = $(this.el).find('ul')
				songs.map((obj)=>{
					let li = document.createElement('li')
					let htmlStr = `
					<svg class="icon" aria-hidden="true"><use xlink:href="#icon-yinle"></use></svg>
					`
					$(li).html(`${htmlStr}<span>${obj.title}</span>`)
						.attr('data-song-id',obj.id)
						.appendTo(ul)
				})
			}
		},
		updateList(){
			if (update) {
				$(this.view.el).find(`[data-song-id=${update.id}]`)
					.addClass('active')
			}
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

			this.renderInit()
			this.renderList()
			this.bindEvents()
			this.bindEventHub()
		},
		renderInit(){
			this.view.render()
		},
		renderList(update){
			this.model.find().then(() => {
				this.view.render(this.model.data)
				if (update) {
					$(this.view.el).find(`[data-song-id=${update.id}]`)
						.addClass('active')
				}
			})
		},
		bindEvents() {
			$(this.view.el).on('click', 'li', (el) => {
				$(el.currentTarget).addClass('active')
					.siblings('.active')
					.removeClass('active')

				let selectedId = $(el.currentTarget).attr('data-song-id') 
				let songs = this.model.data.songs
				let data
				for(let i = 0;i<songs.length;i++){
					if(songs[i].id === selectedId ){
						data = songs[i] 
						break
					}
				}
				window.eventHub.emit('selected',data)
				//data {id,...attributes}
			})
		},
		bindEventHub(){
			window.eventHub.on('addSong',()=>{
				this.view.clearActive()
			})
			window.eventHub.on('upLoadSuccess',()=>{
				// this.view.renderList()
			})
			window.eventHub.on('edit',(data)=>{
				if(data.id){
					//update
					this.renderList(data)
					// this.updateList(data)
				}else{
					//add new song
					this.renderList()	
				}

			})
		},
	}

	controller.init(model, view)
}