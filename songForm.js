{
	let view = {
		el: '.upLoad>.songInfo',
		template: `
			<h1>歌曲信息</h1>
			<form autocomplete="off">
				<div class="row">
					<label>歌曲标题</label>
					<input name="name" type="text" value="">
				</div>
				<div class="row">
					<label>歌手</label>
					<input name="name" type="text" value="">
				</div>
				<div class="row">
					<label>歌曲外链</label>
					<input name="name" type="text" value="">
				</div>
				<div class="row">
					<label>歌词</label>
					<textarea name="" id="" cols="100" rows="10"></textarea>
				</div>
				<div class="row action">
					<button type="submit">保存</button>
				</div>
			</form>
		`,
		render(){
			let html = this.template
			$(this.el).html(html)
		}

	}

	let model = {

	}

	let controller = {
		model: null,
		view: null,
		init(model,view){
			this.model = model
			this.view = view

			this.view.render()
		}
	} 

	controller.init(model,view)

}