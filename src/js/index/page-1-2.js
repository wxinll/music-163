{
	let view = {
		el: 'section.songs>ol.songlists',
		template:`
			<li>
				<h3>__title__</h3>
				<p>
					<svg class="icon sq" aria-hidden="true">
						<use xlink:href="#icon-sq"></use>
					</svg>
					__singer__
				</p>
				<a class="playButton" href="./playSong.html?id=__id__">
					<svg class="icon play" aria-hidden="true">
						<use xlink:href="#icon-play"></use>
					</svg>
				</a>
			</li>			
		`,
		init(){
			this.$el = $(this.el)
		},
		render(data){
			let songs = data.songs
			let placeholders = ['title', 'singer', 'id']
			songs.map((song)=>{
				let li = this.template
				placeholders.map((string)=>{
					li = li.replace(`__${string}__`,song[string])
				})
				this.$el.append($(li))
			})
		},
	}

	let model = {
		data: {
			songs: {},
		},
		find(){
			var query = new AV.Query('songList')
			return query.find().then((objects) => {
				//objects=array[r,r,r,r...]
				//r={attributes{},id}
				return this.data.songs = objects.map((r)=>{
					let {id,attributes} = r
					return {id,...attributes}
				})
			})
		},
	}

	let controller = {
		view: null,
		model: null,
		init(view,model){
			this.view = view
			this.view.init()
			this.model = model
			this.renderList()
		},
		renderList(){
			this.model.find().then(()=>{
				this.view.render(this.model.data)
			})
		}
	}

	controller.init(view,model)
}