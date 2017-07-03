Article = {

	$ueditor : null,

	/**
	 * 文章列表页
	 * @return {[type]} [description]
	 */
	listEvent : function(){
		this.goPage();
		this.del();
		$('.i-checks').iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            radioClass: 'iradio_square-blue',
        });

        $('.selectedAll').on('ifChecked', function(event){
            $('tbody').find('input').iCheck('check');
        });
        $('.selectedAll').on('ifUnchecked', function(event){
            $('tbody').find('input').iCheck('uncheck');
        });
        $('#delall').bind('click',function(){
        	layer.confirm('确认删除所有选中文章?',function(){
        		var id = []
        		$('tbody [type=checkbox]:checked').each(function(){
        			id.push($(this).attr('cid'))
        		})
        		if(id.length>0){
        			ajaxReturn('del',{id:id},function(){
        				layer.msg('系统处理中...');
        			},function(res){
        				if(res.status){
        					window.location.reload();
        				}else{
        					layer.alert(res.info,{icon:2});
        				}
        			})
        		}else{
        			layer.alert('请选中要删除的文章',{icon:2});
        			return;
        		}
        	})
        })
	},

	goPage : function(){
		$('.pagination li').bind('click',function(){
			window.location.href=$(this).attr('pageurl');
		})
	},

	/**
	 * 文章编辑页
	 */
	editEvent : function(){
		this._editor();
		this.submitEvent();
	},

	submitEvent : function(){
		var self = this;
		$('#editBtn').bind('click',function(){
			layer.confirm('确定提交？',function(){
				var id = $('[name=id]').val();
				var content = CKEDITOR.instances.editor1.getData();
				var cid = $('[name=cate]').val();
				var title = $.trim($('#title').val());
				var remark = $.trim($('#remark').val());
				var thumbnail = $('[name=thumbnail]').val();
				var banner = $('[name=banner]').val();
				var add_time = $.trim($('#add_time').val());
				if(title!=''){
					ajaxReturn(saveUrl,{
						id : id,
						cid : cid,
						title : title,
						remark : remark,
						content : content,
						thumbnail : thumbnail,
						add_time : add_time,
						banner : banner
					},null,function(res){
						if(res.status){
							layer.alert(res.info,{icon:1});
							window.location.href=listUrl;
						}else{
							layer.alert(res.info,{icon:2});
							return false;
						}
					})
				}else{
					layer.alert('标题不能为空',{icon:2});
					return false;
				}
			})
		})
		$('#editBtn2').bind('click',function(){
			layer.confirm('确定提交？',function(){
				var id = $('[name=id]').val();
				var content = CKEDITOR.instances.editor1.getData();
				var cid = $('[name=cate]').val();
				var title = $.trim($('#title').val());
				var remark = $.trim($('#remark').val());
				var thumbnail = $('[name=thumbnail]').val();
				var banner = $('[name=banner]').val();
				var add_time = $.trim($('#add_time').val());
				if(title!=''){
					ajaxReturn(saveUrl,{
						id : id,
						cid : cid,
						title : title,
						remark : remark,
						content : content,
						thumbnail : thumbnail,
						add_time : add_time,
						banner : banner
					},null,function(res){
						if(res.status){
							layer.alert(res.info,{icon:1});
							//listUrl=str.replace(".html","");
							//listUrl=listUrl+'/cid/'+cid+'.html';
							window.location.href=listUrl+'?cid='+cid;
						}else{
							layer.alert(res.info,{icon:2});
							return false;
						}
					})
				}else{
					layer.alert('标题不能为空',{icon:2});
					return false;
				}
			})
		})
	},

	del : function(){
		$('.del').bind('click',function(){
			var id = $(this).parent().attr('cid');
			layer.confirm('确定删除该文章吗？',function(){
				ajaxReturn(delUrl,{id:id},null,function(res){
					if(res.status){
						layer.alert(res.info,{icon:1});
						window.location.reload();
					}else{
						layer.alert(res.info,{icon:2});
						return;
					}
				})
			})
			
		})
	},

	_editor : function(){
		CKEDITOR.config.height = 500;
		CKEDITOR.config.width = 'auto';
		CKEDITOR.replace('editor1',{allowedContent:true,filebrowserImageUploadUrl : imgArcUrl,
                        image_previewText : ' ',}); 
		/*this.$ueditor = UM.getEditor('myEditor');
	    this.$ueditor.addListener('blur',function(){
	        $('#focush2').html('编辑器失去焦点了')
	    });
	    this.$ueditor.addListener('focus',function(){
	        $('#focush2').html('')
	    });*/
	}
}