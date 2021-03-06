{
	let view = {
		el: '.upLoad-wrapper',
		find: function(seclor) {
			return document.querySelector('#uploadButton')
		},
	}
	let model = {
		data:null,
	}
	let controller = {
		model: null,
		view: null,
		init(view, model) {
			this.view = view
			this.model = model
			this.initQiniu()
		},
		initQiniu() {
			var uploader = Qiniu.uploader({
				runtimes: 'html5', //上传模式,依次退化
				browse_button: this.view.find('#uploadButton'), //上传选择的点选按钮，**必需**
				uptoken_url: 'http://localhost:8555/uptoken',
				domain: 'pb2dyvgbu.bkt.clouddn.com', //bucket 域名，下载资源时用到，**必需**
				get_new_uptoken: false, //设置上传文件的时候是否每次都重新获取新的token
				max_file_size: '40mb', //最大文件体积限制
				dragdrop: true, //开启可拖曳上传
				drop_element: this.view.find('.upLoad-wrapper'), //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
				auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
				init: {
					'FilesAdded': (up, files) => {
						plupload.each(files, function(file) {
							// 文件添加进队列后,处理相关的事情
						});
					},
					'BeforeUpload': (up, file) => {
						// 每个文件上传前,处理相关的事情
						window.eventHub.emit('beforeUpload')
					},
					'UploadProgress': (up, file) => {
						// 每个文件上传时,处理相关的事情
					},
					// 文件上传成功之后调用 FileUploaded
					'FileUploaded': (up, file, info) => {
						var domain = up.getOption('domain');
						var response = JSON.parse(info.response);
						var sourceLink = 'http://' + domain + '/' + encodeURIComponent(response.key);
						let data = {
							title: response.key,
							link: sourceLink,
						}
						this.model.data = data
						eventHub.emit('upLoadSuccess',data)
						//通知eventHub此模块upLoad完成，执行upLoad列表里对应的函数,data传到hub中被其它函数调用
					},
					'Error': function(up, err, errTip) {
						//上传出错时,处理相关的事情
					},
					'UploadComplete': function() {
						//队列文件处理完毕后,处理相关的事情
					},
				}
			})
		}
	}

	controller.init(view,model)
}