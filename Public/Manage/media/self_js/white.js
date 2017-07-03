whiteName = {
	$target : null,
	pageParams : {},
	type : 0,
	init : function(){
		this.$target = $('#tbody');
		this.$header = $('#thead');
		this.loadList();
		
        
	},
	buildQueryParams : function(){
		this.pageParams.type = $('[name=type]').val();
		this.pageParams.status = $('[name=status]').val();
		this.pageParams.admincheck = $('[name=admincheck]').val();
		this.pageParams.daterange = $('[name=daterange]').val();
		this.pageParams.gid = $('[name=group]').val();
		this.pageParams.start_time = $.trim($('#start').val());
		this.pageParams.end_time = $.trim($('#end').val());
		this.pageParams.account = $.trim($('[name=account]').val());
	},

	
	
	loadList : function(url){
		var self = this;
		if(typeof url === 'undefined'){
			var url = loadListUrl;
		}
		this.buildQueryParams();
		ajaxReturn(url,this.pageParams,function(){
			self.$target.html('努力加载中...');$('#page').empty();
		},function(res){
			if(res.status){
				self.$target.html(self.buildHtml(res.info.list));
				$('#page').empty().html(res.info.page);
				self.checkListEvent();
				self.bankicon();
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

	bankicon : function(){
		$('.bankicon span').unbind('click').bind('click',function(event){
			event.stopPropagation();
			var url = $(this).attr('url');
			layer.open({
			    type: 1,
			    title : false,
			    skin: 'layui-layer-demo', //样式类名
			    closeBtn: 0, //不显示关闭按钮
			    shift: 1,
			    area: ['auto','auto'],
			    shadeClose: true, //开启遮罩关闭
			    content: '<img style="width:600px;" src="'+url+'">'
			});
		});
	},

	buildHtml : function(data){
		
			var html = '<thead><tr><td>编号</td><td>ip</td><td>备注</td><td colspan="2">操作</td></tr></thead><tbody>';
			for(var i=0;i<data.length;i++){
				

				html+='<tr><td>'+data[i].id+'</td><td>'+data[i].ip+'</td><td>'+data[i].remark+'</td><td><a href="'+modifyUrl+'?rsid='+data[i].id+'" class="btn green radius btn-sm modify">修改</a></td>'
				+'<td>&nbsp;<button did="'+data[i].id+'" class="btn red radius btn-sm del">删除</button></td></tr>'	  	
			}
			html += '</tbody>';
		
		return html;
	},


	handle : function(){
		

		$('.del').bind('click',function(){
			var did = $(this).attr('did');
			layer.confirm('确认删除？',function(){
				ajaxReturn("delSetting",{
					id:did
				},function(){
					layer.msg('系统处理中...');
				},function(res){
					if(res.status){
						layer.closeAll();
						checkDeposits.loadList();
					}else{
						layer.alert(res.info,{icon:2});
						return;
					}
				})
			})
		})
	}
}