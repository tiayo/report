Account = {

	init : function(){
		this.params = {}
		this.$target = $('#tbody');
		this.$page = $('#page');
		this.params.loadgroup=1;
		this.loadAlist();
		delete(this.params.loadgroup);
		this.searchEvent();
		this.pageEvent();
	},
	pageEvent : function(){
		$(document).off('click','#page ul li')
					.on('click','#page ul li',function(){
			var pageurl = $(this).attr('pageurl');
			Account.loadAlist(pageurl)
		})
		$('[name=pagesize]').bind('change',function(){
			Account.params.pagesize = $(this).val()
			Account.loadAlist()
		})
	},

	searchEvent : function(){
		$(document).on('click','#sub',function(){
			Account.params.account = $.trim($('[name=account]').val());
			Account.loadAlist();
		})
		$(document).on('keypress','[name=account]',function(event){
            if(event.keyCode == "13")    
            {
                Account.params.account = $.trim($('[name=account]').val());
				Account.loadAlist();
            }
        });
	},

	bindmtEvent:function(){
		this.resetMtpwd();
		this.delMtuser();
		this.changeBalance();
	},

	resetMtpwd : function(){
		$('.resetpwd').unbind('click').bind('click',function(event){
			layer.msg('提示: 执行中断...')
		});
	},


	delMtuser : function(){		
		$('.deluser').unbind('click').bind('click',function(event){
			layer.msg('提示: 执行中断...')
		});
	},

	loadAlist : function(url){
		if(typeof url=='undefined'){
			var url = URLindex;
		}
		ajaxReturn(url,this.params,function(){
			layer.msg('努力加载中...',{time:5000000})
		},function(res){
			
			if(res.status){

				layer.closeAll();
				Account.$target.empty().html(Account.alist(res.info.list));
				Account.$page.html(res.info.page);				
				Account.bindmtEvent();
			}else{
				layer.alert(res.info,{icon:2})
			}
		})
	},

	changeBalance : function(){
		$('.changeBalance').unbind('click').bind('click',function(event){
			layer.msg('提示: 执行中断...')
		})
	},

	alist : function(list){
		if(typeof level == 'undefined'){
			var level = 0;
		}
		var html = '';
		if(list.length>0){
			$.each(list,function(k,v){
				var regtime = getLocalTime(v.reg_time);
				html += '<tr>'+
				  			'<td>'+v.id+'</td>'+
				  			'<td>'+v.login+'</td>'+
				  			'<td>'+v.name+'</td>'+
				  			'<td><span class="badge badge-success">'+v.email+'</span></td>'+
				  			'<td>'+v.password+'</td>'+
				  			'<td>'+v.password_investor+'</td>'+
				  			'<td>1:'+v.leverage+'</td>'+
				  			'<td>'+v.balance+'</td>'+
				  			'<td>'+v.reg_ip+'</td>'+
				  			'<td>'+regtime+'</td><td>'+
				  		// html+='<div class="btn-group">'+
								// 	'<a class="btn red" href="#" data-toggle="dropdown">'+
								// 	'<i class="icon-user"></i> 更多'+
								// 	'<i class="icon-angle-down"></i>'+
								// 	'</a>'+
								// 	'<ul class="dropdown-menu">'+
								// 		'<li><a href="javascript:;" class="resetpwd" data-login = "'+v.id+'">重置密码</a></li>';
								// html+=	'<li><a href="javascript:;" class="changeBalance" data-login = "'+v.id+'" data-balance="'+v.balance+'">更改账户余额</a></li>'+
								// 		'<li class="divider"></li>'+
								// 		'<li><a href="javascript:;" class="deluser" data-login = "'+v.id+'" data-id = "'+v.id+'"><i class="i"></i> 删除用户</a></li>'+
								// 	'</ul>'+
								// '</div>'+
				  			'</td>'+
				  		'</tr>';
			})
		}else{
			if(typeof agent_account != 'undefined'){
				html += '<tr class="'+agent_account+'" align="center"><td colspan="9">暂时没有数据...</td></tr>';	
			}
					
		}

		return html;
	},
	
}