Letter = {
	pageParams :{},
	init : function(){
		this.loadUserLists();
		this.searchEvent();
		this.toObjEvent();
		this.submitEvent();
		this.loadEmailLists();
		this.loadReceiveLists();
	},
	loadUserLists:function(url){
		var self = this;
		if(url===undefined){
			url = 'userLists';
		}
		ajaxReturn(url,this.pageParams,function(){
			layer.msg('用户加载中...');
		},function(res){
			layer.closeAll();
			if(res.status){	
				var html='<thead>'+
							'<tr>'+
								'<th><input type="checkbox" class="group-checkable" data-set=".checkboxes"></th>'+
								'<th>用户ID</th>'+
								'<th>用户姓名</th>'+
							'</tr>'+
						'</thead>';
				var params = res.info.lists;
				var typeall = res.info.typeall;
				var shtml = '';
				for (var i = 0; i < params.length; i++) {
							html += '<tr class="odd gradeX">'+
										'<td><input type="checkbox" class="checkboxes" value='+params[i].id+' name="user[]"/></td>'+	
										'<td>'+params[i].id+'</td>'+
										'<td class="">'+params[i].name+'</td>'+
								'</tr>';
						};
						$.each(typeall,function(k,v) {
							shtml += '<option value="'+k+'">'+v.title+'</option>';
						});
				$('#user_lists').empty().html(html);
				jQuery('.group-checkable').change(function () {
                	var set = jQuery(this).attr("data-set");
	                var checked = jQuery(this).is(":checked");
	                jQuery(set).each(function () {
	                    if (checked) {
	                        $(this).attr("checked", true);
	                    } else {
	                        $(this).attr("checked", false);
	                    }
	                });
	                jQuery.uniform.update(set);
	            });
				$('#user_type').empty().html(shtml);
				self.pageEvent();	
				self.searchEvent();	
			}else{
				$('#user_lists').empty().html(res.info);
			}
		})
	},
	searchEvent:function(){
		var self = this;
		$('#search').unbind('click').bind('click',function(){
			self.pageParams.user = $.trim($('[name="user"]').val());
			self.loadUserLists();
		})
	},
	pageEvent : function(){
		var self = this;
		$('#page ul li').unbind('click').bind('click',function(){
			var pageurl = $(this).attr('pageurl');
			self.loadUserLists(pageurl);
		})
	},
	toObjEvent:function(){
		$('[name="obj_type"]').change(function(){
			var checkval = $(this).val();
			if(checkval=='1'){
				$('#user_box').show();
				$('#all_type').hide();
			}else if(checkval=='2'){
				$('#user_box').hide();
				$('#all_type').show();
			}else{
				$('#user_box').hide();
				$('#all_type').hide();
			}
		})
	},
	submitEvent:function(){
		$("#import").click(function(){
			if(!$("[name=title]").val()){
				layer.tips('请填写信息标题！','#title');
				return;
			}
			if(!$("[name=content]").val()){
				layer.tips('请填写信息内容！','#content');
				return;
			}
			var obj_type = $("[name=obj_type]:checked").val();
			var parparams = {
				content : $.trim($("[name=content]").val()),
				title : $.trim($("[name=title]").val()),
				obj_type : obj_type,
			}
			if(obj_type=='1'){
				var select_user = '';
				$('.checkboxes').each(function() {
					if($(this).is(':checked')){
						select_user+=$(this).val()+',';
					}
				});
				if(select_user==''){
					layer.alert('请选择用户!',{icon:2});
					return;
				}else{
					$('[name="select_user"]').val(select_user);
					// parparams.select_user = select_user;
				}
			}else if(obj_type=='2'){
				parparams.user_type = $('[name="user_type"]').val();
			}
			var formData = new FormData($( "#uploadForm" )[0]); 
	        $.ajax({  
		          url: stationletterUrl ,  
		          type: 'POST',  
		          data: formData,  
		          async: false,  
		          cache: false,  
		          contentType: false,  
		          processData: false,  
		          success: function (res) { 
		          		if(res['status']){
		          			layer.msg(res.info,{icon:1});
		          			setTimeout(function(){
								window.location.reload();
							},1500)
		          		}else{
		          			layer.alert(res.info,{icon:2});
		          		}
		          		// $('[name="file"]').attr('file',res.info['file']['savepath']+res.info['file']['savename']); 
		          },  
		          error: function (res) {  
		              	// $(".help-block").empty().text(res.info);
		          }  
		     });
		});
	},
	loadEmailLists:function(url){
		var self = this;
		if(typeof url == 'undefined'){
			var url = loadEmailListsUrl;
		}
		ajaxReturn(url,{},function(){
			layer.msg('加载中',{time:5000000})
		},function(res){
			if(res.status){
				layer.closeAll();
				var html='<thead class="flip-content">'+
							'<tr>'+
						  		'<th>标题</th>'+
						  		'<th>收件人</th>'+
						  		'<th>状态</th>'+
						  		'<th>创建日期</th>'+
						  		'<th>操作</th>'+
							'</tr>'+
						'</thead>';
				$.each(res.info.list,function(k,v){
					html += '<tr>'+
								'<td>'+v.title+'</td>'+
								'<td>'+v.touser+'</td>'+
								'<td class="showstatus">';
								if(v.is_cancel=='1'){
									html+='<span class="badge badge-important">已撤回</span>';
								}else{
									html+='<span class="badge badge-success">正常</span>';
								}
						html+=	'</td>'+
								'<td>'+v.create_at+'</td>'+
								'<td><button class="btn blue mini edit" data-id="'+v.id+'">编辑</button><button class="btn red mini cancel" data-id="'+v.id+'">撤回</button></td>'+
							'</tr>';
				});
				$('#email-list').empty().html(html);
				$("#page3").empty().html(res.info.page);
				$('#page3 ul li').unbind('click').bind('click',function(){
					var pageurl = $(this).attr('pageurl');
					self.loadEmailLists(pageurl);
				})
				self.editEmail();
				self.delEmail();
				self.cancelEmail();
				
			}
		});
	},
	editEmail:function(){
		$('.edit').unbind('click').bind('click', function() {
			var id = $(this).data('id');
			ajaxReturn('letterEdit',{id:id},null,function(res){
				if(res.status){
					var html='<div class="form-horizontal">'+
								'<div class="control-group">'+
									'<label class="control-label">标题</label>'+
									'<div class="controls">'+
										'<input type="text" class="large m-wrap" name="edittitle" value="'+res.info.title+'">'+
									'</div>'+
								'</div>'+
								'<div class="control-group">'+
									'<label class="control-label">发送内容</label>'+
									'<div class="controls">'+
										'<textarea class="large m-wrap" rows="10" name="editcontent">'+res.info.content+'</textarea>'+
									'</div>'+
								'</div>'+
							'</div>';
					layer.open({
					  area: ['600px', 'auto']
					  ,title: '编辑信息'
					  ,shade: 0.6 //遮罩透明度
					  ,shadeClose:true
					  ,content: html,
					  success:function(){

					  },
					  yes:function(){
					  	var title = $('[name="edittitlee"]').val();
					  	var content = $('[name="editcontent"]').val()
					  	ajaxReturn('saveLetter',{id:id,title:title,content:content},null,function(res){
					  		if(res.status){
					  			layer.alert(res.info,{icon:1});
					  		}else{
					  			layer.alert(res.info,{icon:2});
					  		}
					  	})
					  }
					}); 
				}
			})
			
			
		});
	},
	delEmail:function(){
		$('.del').unbind('click').bind('click', function() {
			var id = $(this).data('id');
			layer.confirm('确定撤销？',function(){
				ajaxReturn('delLetter',{id:id},null,function(res){
					if(res.status){
			  			layer.alert(res.info,{icon:1});
			  		}else{
			  			layer.alert(res.info,{icon:2});
			  		}
				})
			})
		});
	},
	cancelEmail:function(){
		$('.cancel').unbind('click').bind('click', function() {
			var id = $(this).data('id');
			var $this = $(this);
			layer.confirm('确定撤销？',function(){
				ajaxReturn('cancelLetter',{id:id},null,function(res){
					if(res.status){
						$this.parents('tr').find('.showstatus').empty().html('<span class="badge badge-important">已撤回</span>');
			  			layer.alert(res.info,{icon:1});
			  		}else{
			  			layer.alert(res.info,{icon:2});
			  		}
				})
			})
		});
	},
	loadReceiveLists:function(url){
		var self = this;
		if(typeof url == 'undefined'){
			var url = loadReceiveListsUrl;
		}
		ajaxReturn(url,{},function(){
			layer.msg('加载中',{time:5000000})
		},function(res){
			if(res.status){
				layer.closeAll();
				var html='<thead class="flip-content">'+
							'<tr>'+
						  		'<th>标题</th>'+
						  		'<th>内容</th>'+
						  		'<th>发件人</th>'+
						  		'<th>状态</th>'+
						  		'<th>发送日期</th>'+
						  		'<th>操作</th>'+
							'</tr>'+
						'</thead>';
				$.each(res.info.list,function(k,v){
					html += '<tr>'+
								'<td>'+v.title+'</td>'+
								'<td>'+v.content+'</td>'+
								'<td>'+v.send_user+'</td>'+
								'<td class="readstatus">';
								if(v.is_read=='1'){
									html+='<span class="badge badge-success">已读</span>';
								}else{
									html+='<span class="badge badge-important">未读</span>';
								}
						html+=	'</td>'+
								'<td>'+v.create_at+'</td>'+
								'<td><button class="btn blue mini mark" data-id="'+v.id+'">标记已读</button><button class="btn red mini del-msg" data-id="'+v.id+'">删除</button></td>'+
							'</tr>';
				});
				$('#receive-list').empty().html(html);
				$("#page2").empty().html(res.info.page);
				$('#page2 ul li').unbind('click').bind('click',function(){
					var pageurl = $(this).attr('pageurl');
					self.loadEmailLists(pageurl);
				})
				self.markRead();
				self.delMsg();
			}
		});
	},
	markRead:function(){
		$('.mark').unbind().bind('click', function() {
			var id = $(this).data('id');
			var $this = $(this);
			ajaxReturn('markRead',{id:id},null,function(res){
				if(res.status){
					$this.parents('tr').find('.readstatus').empty().html('<span class="badge badge-success">已读</span>');
				}
			})
		});
	},
	delMsg:function(){
		$('.del-msg').unbind('click').bind('click', function() {
			var id = $(this).data('id');
			var $this = $(this);
			layer.confirm('确定删除？',function(){
				ajaxReturn('delMsg',{id:id},null,function(res){
					if(res.status){
						$this.parents('tr').remove();
			  			layer.alert(res.info,{icon:1});
			  		}else{
			  			layer.alert(res.info,{icon:2});
			  		}
				})
			})
		});
	},

}