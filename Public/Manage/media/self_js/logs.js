logs = {
	$target : null,
	pageParams : {},
	init : function(){
		this.$target = $('#tbody');
		this.loadList();
		this.searchEvent();
        this.batchAll();
	},

	searchEvent : function(){

		var self = this;
		$('#submit').unbind('click').bind('click',function(){

			self.pageParams.starttime = $.trim($('[name=starttime]').val());
			self.pageParams.endtime = $.trim($('[name=endtime]').val());
			self.pageParams.type = $.trim($('[name=type] option:selected').val());

			self.loadList();
		})
	},
	
	batchAll : function(){
		$(document).on('ifChecked','#selectedAll' ,function(event){
            logs.$target.find('input').iCheck('check');
        }).on('ifUnchecked', '#selectedAll',function(event){
            logs.$target.find('input').iCheck('uncheck');
        });
		$(document).on('click','#batchAll',function(){
			layer.confirm('确认批量删除吗？',function(){
				var arr = [];
				logs.$target.find('tbody [type=checkbox]:checked').each(function(){
					var $o = $(this);
					var did = $o.attr('did');
					arr.push(did);
				})
				if(arr.length>0){
					ajaxReturn(del,{id:arr.join(',')},function(){
						layer.msg('批量删除中...');
					},function(res){
						if(res.status){
							layer.closeAll();
							logs.loadList();
						}else{
							layer.alert(res.info,{icon:2})
						}
					})
				}else{
					layer.alert('请选择要删除的订单',{icon:2});return;
				}
			})
			
		})
	},

	icheck : function(){
		$('.i-check').iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            radioClass: 'iradio_square-blue'
        });
	},

	loadList : function(url){
		var self = this;
		if(typeof url === 'undefined'){
			var url = loadListUrl;
		}
		ajaxReturn(url,this.pageParams,function(){
			self.$target.html('努力加载中...');$('#page').empty();
		},function(res){
			if(res.status){
				self.$target.html(self.buildHtml(res.info.list));
				$('#page').empty().html(res.info.show);
				self.checkListEvent();
				self.icheck();
			}else{
				layer.alert(res.info,{icon:2});
				return;
			}
		})
	},

	checkListEvent : function(){
		var self = this;
		$('.pagination li').bind('click',function(){
			var url = $(this).attr('pageurl');
			if(url !=''){
				self.loadList(url);
			}
		});
		this.handle();
	},

	buildHtml : function(data){
			var html = '<thead class="flip-content"><tr>'+
				  		'<th><input id="selectedAll" class="i-check" type="checkbox" /></th>'+
				  		'<th>行为</th>'+
				  		'<th>管理员账户</th>'+
				  		'<th>执行者行为ip</th>'+
				  		'<th>触发行为的表</th>'+
				  		'<th>触发行为的数据id</th>'+
				  		'<th>日志备注</th>'+
				  		'<th>执行行为时间</th>'+
				  		// '<th>操作</th>'+
				  	'</tr></thead><tbody>';
			$.each(data,function(k,v){
			html += '<tr>'+
					'<td><input did="'+v.id+'" class="i-check" type="checkbox" /></td>'+
					'<td>'+v.name+'</td>'+
					'<td>'+v.account+'</td>'+
					'<td>'+v.action_ip+'</td>'+
					'<td>'+v.model+'</td>'+
					'<td>'+v.record_id+'</td>'+
					'<td>'+v.remark+'</td>'+
					'<td>'+v.create_at+'</td>'+
					// '<td><button did="'+v.id+'" class="btn red radius btn-sm del">删除</button></td>'+
					'</tr>';
		});
			html += '</tbody>';
		return html;
	},

	handle : function(){
		$('.del').bind('click',function(){
			var did = $(this).attr('did');
			layer.confirm('确认删除？',function(){
				ajaxReturn(del,{
					id:did
				},function(){
					layer.msg('系统处理中...');
				},function(res){
					if(res.status){
						layer.closeAll();
						logs.loadList();
					}else{
						layer.alert(res.info,{icon:2});
						return;
					}
				})
			})
		})
	}
}