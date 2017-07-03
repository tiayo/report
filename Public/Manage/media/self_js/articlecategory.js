ArticleCategory = {

	init : function(){
		this.addCategory();
		this.delCategory();
		this.editCategory();
	},

	editCategory : function(){
		var self = this;
		$('.edit').bind('click',function(){
			var cid = $(this).parent().attr('cid');
			ajaxReturn(getInfoForCidUrl,{cid:cid},null,function(res){
				if(res.status){
					layer.open({
						shadeClose: true,
						shade: 0.5,
						title : '编辑-'+res.info.result.name,
					    // skin: 'layui-layer-rim', //加上边框
					    area: ['550px', 'auto'], //宽高
					    content: self.buildEditHtml(res.info),
					    yes: function(){
							var editcatename = $.trim($('[name=editcatename]').val());
							var sort = $.trim($('[name=sort]').val());
							var pid = $('[name=editcate]').val();
							var remark = $.trim($('[name=remarks]').val());
							if(editcatename==''){
								layer.alert('分类名称不能为空',{icon:2});
								return false;
							}
							ajaxReturn(editCategoryUrl,{
								id: res.info.result.id,
								name : editcatename,
								sort : sort,
								pid:pid,
								remark : remark,
								language : $('[name="editlan"]').val()
							},null,function(res){
								if(res.status){
									layer.alert(res.info,{icon:1});
									window.location.reload();
								}else{
									layer.alert(res.info,{icon:2});
									return;
								}
							})
						}
					});
				}else{
					layer.alert(res.info,{icon:2});
				}
			})
		})
	},

	buildEditHtml : function(info){
			var html ='<div class="form-horizontal">'+
						'<div class="control-group">'+
							'<label class="control-label">上级栏目</label>'+
							'<div class="controls">'+
								'<select class="medium m-wrap" name="editcate"><option value="0">顶级分类</option>';
								$.each(info.result2,function(k,v){
							      	if(v.id==info.result.pid){
							      		html += '<option selected=true value="'+v.id+'">'+v.html+v.name+'</option>';
							      	}else{
							      		html += '<option value="'+v.id+'">'+v.html+v.name+'</option>';
							      	}
							      	  
							      })
								html += '</select>'+
							'</div>'+
						'</div>'+
						'<div class="control-group">'+
							'<label class="control-label">文章语言</label>'+
							'<div class="controls">'+
								'<select class="medium m-wrap" name="editlan">'+
									'<option value="0">中文文章</option>'+
									'<option value="1"';
										if(info.result.language=='1'){
											html+=' selected>英文文章</option>';
										}else{
											html+='>英文文章</option>';
										}			
								html+='</select>'+
							'</div>'+
						'</div>'+
						'<div class="control-group">'+
							'<label class="control-label"> 分类名称</label>'+
							'<div class="controls">'+
								'<input type="text" class="m-wrap medium" name="editcatename" value="'+info.result.name+'">'+
							'</div>'+
						'</div>'+
						'<div class="control-group">'+
							'<label class="control-label"> 备注</label>'+
							'<div class="controls">'+
								'<input type="text" class="m-wrap medium" name="remarks" value="'+info.result.remark+'">'+
							'</div>'+
						'</div>'+
						'<div class="control-group">'+
							'<label class="control-label"> 排序</label>'+
							'<div class="controls">'+
								'<input type="text" class="m-wrap medium" name="sort" value="'+info.result.sort+'">'+
							'</div>'+
						'</div>'+
					'</div>';
		return html;
	},

	addCategory : function(){
		$('#addCate').bind('click',function(){
			layer.confirm('确定添加分类？',function(){
				var pid = $.trim($('[name=cate]').val());
				var cname = $.trim($('#cateinput').val());
				var remark = $.trim($('#remark').val());
				var language = $('[name="language"]').val();
				if(cname==''){
					layer.alert('分类名称不能为空',{icon:2});
					return;
				}
				ajaxReturn(addCategoryUrl,{
					pid : pid,
					name : cname,
					remark : remark,
					language : language
				},null,function(res){
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

	delCategory : function(){
		$('table').off('click','.del').on('click','.del',function(){
			var cid = $(this).parent().attr('cid');
			layer.confirm('确定删除此分类？',function(){
				ajaxReturn(delCategoryUrl,{cid:cid},null,function(res){
					if(res.status){
						layer.alert(res.info,{icon:1});
						window.location.reload();
					}else{
						layer.alert(res.info,{icon:2});
					}
				})
			})
		})	
	}
}