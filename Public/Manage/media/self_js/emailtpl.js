emailTpl = {

	$editorElement : null,


	/**
	 * 文章编辑页
	 */
	editEvent : function(){
		// this._editor();
		this.submitEvent();
	},

	submitEvent : function(){
		var self = this;
		$('#editBtn,#add_new').bind('click',function(){
			var id = $(this).data('id');
			var html='<div class="form-horizontal">'+
					'<div class="control-group">'+
						'<label class="control-label">邮件类型</label>'+
						'<div class="controls">'+
							'<input class="m-wrap " type="text" name="email_type" value="">'+
						'</div>'+
					'</div>'+
					'<div class="control-group">'+
						'<label class="control-label">邮件标题</label>'+
						'<div class="controls">'+
							'<input class="m-wrap " type="text" name="email_title" value="">'+
						'</div>'+
					'</div>'+
					'<div class="control-group">'+
						'<label class="control-label">发件人名称</label>'+
						'<div class="controls">'+
							'<input class="m-wrap " type="text" name="from_name" value="">'+
						'</div>'+
					'</div>'+
					'<div class="control-group">'+
						'<label class="control-label">邮件编辑器</label>'+
						'<div class="controls">'+
							// '<script type="text/plain" name="content" id="myEditor" style="width:100%;height:400px;"></script>'+
							'<div id="editor1"></div>'+
						'</div>'+
					'</div>'+
				'</div>';
				layer.open({
					shadeClose: true,
					shade: 0.5,
					area: ['960px', '80%'],
					title: '邮件模板',
					content: html,
					success:function(){

					    CKEDITOR.config.height = 400;
						CKEDITOR.config.width = 'auto';
						CKEDITOR.config.baseFloatZIndex = 29891015;
						CKEDITOR.config.allowedContent = true;
						CKEDITOR.config.filebrowserImageUploadUrl = imgArcUrl;
						CKEDITOR.config.image_previewText = ' ';
						// CKEDITOR.replace('editor1',{allowedContent:true,filebrowserImageUploadUrl : imgArcUrl,image_previewText : ' ',}); 
					    /*if(self.$ueditor!==null){
							self.$ueditor.destroy();
						}
						self.$ueditor = UM.getEditor('myEditor');*/
						/*self.$ueditor.addListener('blur',function(){
					        $('#focush2').html('编辑器失去焦点了')
					    });
					    self.$ueditor.addListener('focus',function(){
					        $('#focush2').html('')
					    });*/
					    if(id!==undefined){
					    	ajaxReturn('getOneEmail',{id:id},null,function(res){
								$('[name="email_type"]').val(res.info.email_type);
								$('[name="email_title"]').val(res.info.email_title);
								$('[name="from_name"]').val(res.info.from_name);
					            //$("#content").ckeditor();

					            if( CKEDITOR.instances['editor1'] ){
						            CKEDITOR.remove(CKEDITOR.instances['editor1']);
						        }
						        CKEDITOR.replace('editor1',{allowedContent:true});
					            CKEDITOR.instances.editor1.setData(res.info.content);
								/*if(self.$editorElement===null){
									self.$editorElement = CKEDITOR.document.getById( 'editor1' );
								}
								self.$editorElement.setHtml(
									res.info.content
								);*/
								// CKEDITOR.instances.editor1.setData(res.info.content);
								// self.$ueditor.setContent(res.info.content,true);
							})
					    }else{
					    	CKEDITOR.replace('editor1',{allowedContent:true});  
					    }
					},
					yes: function(index, layero){
						var email_type = $.trim($('[name="email_type"]').val());
						var email_title = $.trim($('[name="email_title"]').val());
						var from_name = $.trim($('[name="from_name"]').val());	
						layer.confirm('确定提交？',function(){
							var params = {
								content : CKEDITOR.instances.editor1.getData(),
								email_type : email_type,
								email_title : email_title,
								from_name : from_name,
							} 
							if(id!==undefined){
								params.id = id;
							}
							if(params.email_type!=''){
								ajaxReturn(saveUrl,params,null,function(res){
									if(res.status){
										layer.alert(res.info,{icon:1});
										window.location.reload();
									}else{
										layer.alert(res.info,{icon:2});
									}
								})
							}else{
								layer.alert('邮件类型不能为空',{icon:2});
							}
							
						})
					 	
					},
				})
		})
	},
}