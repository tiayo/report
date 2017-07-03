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
			Account.params.status = $('[name=statusc] option:selected').val();
			Account.loadAlist();
		})
		$(document).on('keypress','[name=account]',function(event){
            if(event.keyCode == "13")    
            {
                Account.params.account = $.trim($('[name=account]').val());
				Account.params.status = $('[name=statusc] option:selected').val();
				Account.loadAlist();
            }
        });
	},

	searchGet : function(){
		if(getstatus){
			//Account.params.account = vaa;
			//Account.params.status = getstatus;
			//$("select[name=statusc]").val(getstatus);
			//$("#statusc option[text='jQuery']").attr("selected", true);
			Account.params.status = $('[name=statusc] option:selected').val();
			Account.loadAlist();
		}
	},

	bindmtEvent:function(){
		this.resetMtpwd();
		this.mtActive();
		this.delMtuser();
		this.changeMtGroup();
		this.changeInmoney();
		this.changeOutmoney();
		this.changeTrades();
		this.changeBalance();
	},

	resetMtpwd : function(){
		$('.mt_reset').unbind('click').bind('click',function(event){
			event.stopPropagation();
			var login=$(this).data("login");
			layer.confirm('确认重置密码?',function(){
				ajaxReturn(URLresetMtpwd,{
					login:login
				},null,function(res){
					if(res.status){
						layer.alert('重置后的密码为：'+res.info.password,{icon:1});
					}else{
						layer.alert(res.info,{icon:2});
						return;
					}
				})
			})
		});
	},

	mtActive : function(){
		$(".mt_active").unbind('click').bind('click',function(event){
			event.stopPropagation();
			var self = this;
			var login=$(this).data("login");
			var email=$(this).data("email");
			var id=$(this).data("id");
			
			layer.confirm('确认审核？',function(){
				ajaxReturn(URLmtActive,{
					login:login
				},function(){
					layer.msg('激活中...');
				},function(res){
					if(res.status){
						layer.closeAll();
						$(self).remove();
						$("#mtnotactive"+id).html("<span class='badge badge-success'>已审核</span>");
						ajaxReturn(URLsendEmailToUser,{
							email : email,
							id: id,
							type : 'mt'
						},null,null);
					}else{
						layer.alert(res.info,{icon:2});
						return;
					}
				})
			})
		});
	},


	delMtuser : function(){		
		$('.mt_del').unbind('click').bind('click',function(event){
			event.stopPropagation();
			var id=$(this).data("id");
			var login=$(this).data("login");
			var message = '考虑到安全性，系统只清除该账户在本系统的资料并在mt4中禁用本账号，如需完全删除请到mt4中操作'
			layer.confirm(message,{
				 btn: ['确定删除','取消'] 
			},function(){
				ajaxReturn(URLdelMtuser,{
					id : id,
					login : login
				},null,function(res){
					if(res.status){
						Account.loadAlist();
					}else{
						layer.alert(res.info,{icon:2});
						return;
					}
				})
			})
		});
	},

	loadAlist : function(url){
		if(typeof url=='undefined'){
			var url = 'listsub';
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

	changeMtGroup:function(){
		$('.mt_changeGroup').unbind('click').bind('click',function(){
			var groups = $(this).data('groups');
			var mygroup = $(this).data('group');
			var login = $(this).data('login');
			var arrgroups = new Array(); //定义一数组 
			arrgroups = groups.split(","); //字符分割 
			var html = '<div class="form-horizontal">'+
								'<div class="control-group">'+
									'<label class="control-label"><strong>'+login+'</strong>的当前用户组:</label>'+
									'<div class="controls">'+
										'<span class="text bold">'+mygroup+'</span>'+
									'</div>'+
								'</div>'+
								'<div class="control-group">'+
									'<label class="control-label"> 更改为:</label>'+
									'<div class="controls">'+
										'<select class="small m-wrap" name="newgroup">';
											for (var i = 0; i < arrgroups.length; i++) {
												html+='<option value="'+arrgroups[i]+'">'+arrgroups[i]+'</option>';
											};
									
										html+='</select>'+	
									'</div>'+
								'</div>'+
							'</div>';
					layer.open({
					    title : '更改账户mt组',
					    skin: 'layui-layer-molv', //样式类名
					    closeBtn: 0, //不显示关闭按钮
					    shift: 1,
					    shadeClose: true, //开启遮罩关闭
					    content: html,
					    yes:function(){
					    	var newgroup = $.trim($('[name=newgroup]').val());
					    	if(mygroup == newgroup){
					    		layer.alert('组无变化，请选择不同组操作！',{icon:5});
					    		return;
					    	}
							layer.confirm('确定更改?',function(){
								ajaxReturn('changeMtGroup',{login:login,newgroup:newgroup},function(){
									layer.msg('系统处理中...');
								},function(res){
									if(res.status){
										layer.msg(res.info,{icon:1});
										setTimeout(function(){
											Account.loadAlist();
										},3000);
									}else{
										layer.alert(res.info,{icon:2});
									}
								})
							})
					    }
					});
		})
	},
	changeBalance : function(){
		$('.mt_changeBalance').unbind('click').bind('click',function(event){
			event.stopPropagation();
			var login=$(this).data("login");
			var balance = $(this).data('balance');
			var html = '<div class="form-horizontal">'+
					'<div class="control-group">'+
						'<label class="control-label"><strong>'+login+'</strong>的账户余额:</label>'+
						'<div class="controls">'+
							'<span class="text bold">$'+balance+'</span>'+
						'</div>'+
					'</div>'+
					'<div class="control-group">'+
						'<label class="control-label"> 更改为:</label>'+
						'<div class="controls">'+
							'<input type="text" class="m-wrap small"  name="newbalance" placeholder="如：100或者-100">'+
						'</div>'+
					'</div>'+
				'</div>';
			layer.open({
			    title : '更改余额',
			    skin: 'layui-layer-molv', //样式类名
			    closeBtn: 0, //不显示关闭按钮
			    shift: 1,
			    shadeClose: true, //开启遮罩关闭
			    content: html,
			    yes:function(){
					var newbalance = $.trim($('[name=newbalance]').val());
					layer.confirm('确定更改?',function(){
						ajaxReturn(URLchangeBalance,{login:login,newbalance:newbalance},function(){
							layer.msg('系统处理中...');
						},function(res){
							if(res.status){
								layer.msg(res.info,{icon:1});
								setTimeout(function(){
									Account.loadAlist();
								},3000);
							}else{
								layer.alert(res.info,{icon:2});
							}
						})
					})
			    }
			});
		})
	},

	alist : function(list){
		if(typeof level == 'undefined'){
			var level = 0;
		}
		var html = '';
		if(list.length>0){
			$.each(list,function(k,v){
				html += '<tr>'+
				  			'<td>'+v.a_uid+'</td>'+
				  			'<td>'+v.login+'</td>'+
				  			'<td>'+v.a_name+'</td>'+
				  			'<td><span class="badge badge-success">'+v.b_group+'</span></td>'+
				  			'<td>'+v.c_name+'</td>'+
				  			'<td id="mtnotactive'+v.a_uid+'">';
				  			if(v.check_status == 1){
					  			html += '<span class="badge badge-success">已审核</span>';
					  		}else{
					  			html += '<span class="badge badge-important">未审核</span>';
					  		}
					  		if(v.is_inmoney == 0){
					  			html += '<span class="badge badge-important">锁定入金</span>';
					  		}
					  		if(v.is_outmoney == 0){
					  			html += '<span class="badge badge-important">锁定出金</span>';
					  		}
					  		if(v.is_trades == 0){
					  			html += '<span class="badge badge-important">锁定交易</span>';
					  		}
					  	html+= '</td>'+
					  			'<td>'+v.create_at+'</td>'+
					  			'<td>';
					  				if(v.check_status == 0){
					  					html += '<button class="btn green mt_active" data-login = "'+v.login+'" data-id = "'+v.a_uid+'" data-email="'+v.c_email+'" style="vertical-align:top;">审核</button>&nbsp;';
					  				}
				  		html+='<div class="btn-group">'+
									'<a class="btn red" href="#" data-toggle="dropdown">'+
									'<i class="icon-user"></i> 更多'+
									'<i class="icon-angle-down"></i>'+
									'</a>'+
									'<ul class="dropdown-menu">'+
										'<li><a href="javascript:;" class="mt_reset" data-login = "'+v.login+'">重置密码</a></li>'+
										'<li><a href="javascript:;" class="mt_changeGroup" data-login = "'+v.login+'" data-group="'+v.b_group+'" data-groups="'+(v.allgroup && (v.allgroup.group))+'">移动到组</a></li>';
										if(v.is_inmoney == 1){
									    	html += '<li><a href="javascript:;" data-login="'+v.login+'" class="mt_changeInmoney" status="0">锁定入金</a></li>';
									    }else{
											html += '<li><a href="javascript:;" data-login="'+v.login+'" class="mt_changeInmoney" status="1">开启入金</a></li>';
										}
										if(v.is_outmoney == 1){
									   		html += '<li><a href="javascript:;" data-login="'+v.login+'" class="mt_changeOutmoney" status="0">锁定出金</a></li>';
									   	}else{
											html += '<li><a href="javascript:;" data-login="'+v.login+'" class="mt_changeOutmoney" status="1">开启出金</a></li>';
									    }
									    if(v.is_trades == 1){
									    	html += '<li><a href="javascript:;" data-login="'+v.login+'" class="mt_changeTrades" status="0">锁定交易</a></li>';
									    }else{
											html += '<li><a href="javascript:;" data-login="'+v.login+'" class="mt_changeTrades" status="1">开启交易</a></li>';
										}
								html+=	'<li><a href="javascript:;" class="mt_changeBalance" data-login = "'+v.login+'" data-balance="'+v.b_balance+'">更改账户余额</a></li>'+
										// '<li><a href="javascript:;" class="mt_reset" data-login = "'+v.login+'">更改账户信用</a></li>'+
										'<li class="divider"></li>'+
										'<li><a href="javascript:;" class="mt_del" data-login = "'+v.login+'" data-id = "'+v.a_uid+'"><i class="i"></i> 删除用户</a></li>'+
									'</ul>'+
								'</div>'+
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
	mtlist:function(list,id,groups,email){
		var html = '';
		if(list.length>0){
			$.each(list,function(k,v){

				html += '<tr class="sub sub-'+v.aid+'">'+
				  			'<td></td>'+
				  			'<td>'+v.name+'┠─<span class="badge badge-warning">'+v.login+'</span></td>'+
				  			'<td><span class="badge badge-success">'+v.group+'</span></td>'+
				  			'<td></td><td></td><td></td>'+
				  			'<td id="mtnotactive'+v.uid+'">';
				  			if(v.check_status == 1){
					  			html += '<span class="badge badge-success">已审核</span>';
					  		}else{
					  			html += '<span class="badge badge-important">未审核</span>';
					  		}
					  		if(v.is_inmoney == 0){
					  			html += '<span class="badge badge-important">锁定入金</span>';
					  		}
					  		if(v.is_outmoney == 0){
					  			html += '<span class="badge badge-important">锁定出金</span>';
					  		}
					  		if(v.is_trades == 0){
					  			html += '<span class="badge badge-important">锁定交易</span>';
					  		}
				  	html+= '</td>'+
				  			'<td>'+v.create_at+'</td>'+
				  			'<td>';
				  				if(v.check_status == 0){
				  					html += '<button class="btn green mt_active" data-login = "'+v.login+'" data-id = "'+v.uid+'" data-email="'+email+'" style="vertical-align:top;">审核</button>&nbsp;';
				  				}
				  		html+='<div class="btn-group">'+
									'<a class="btn red" href="#" data-toggle="dropdown">'+
									'<i class="icon-user"></i> 更多'+
									'<i class="icon-angle-down"></i>'+
									'</a>'+
									'<ul class="dropdown-menu">'+
										'<li><a href="javascript:;" class="mt_reset" data-login = "'+v.login+'">重置密码</a></li>'+
										'<li><a href="javascript:;" class="mt_changeGroup" data-login = "'+v.login+'" data-group="'+v.group+'" data-groups="'+groups+'">移动到组</a></li>';
										if(v.is_inmoney == 1){
									    	html += '<li><a href="javascript:;" data-login="'+v.login+'" class="mt_changeInmoney" status="0">锁定入金</a></li>';
									    }else{
											html += '<li><a href="javascript:;" data-login="'+v.login+'" class="mt_changeInmoney" status="1">开启入金</a></li>';
										}
										if(v.is_outmoney == 1){
									   		html += '<li><a href="javascript:;" data-login="'+v.login+'" class="mt_changeOutmoney" status="0">锁定出金</a></li>';
									   	}else{
											html += '<li><a href="javascript:;" data-login="'+v.login+'" class="mt_changeOutmoney" status="1">开启出金</a></li>';
									    }
									    if(v.is_trades == 1){
									    	html += '<li><a href="javascript:;" data-login="'+v.login+'" class="mt_changeTrades" status="0">锁定交易</a></li>';
									    }else{
											html += '<li><a href="javascript:;" data-login="'+v.login+'" class="mt_changeTrades" status="1">开启交易</a></li>';
										}
								html+=	'<li><a href="javascript:;" class="mt_changeBalance" data-login = "'+v.login+'" data-balance="'+v.balance+'">更改账户余额</a></li>'+
										// '<li><a href="javascript:;" class="mt_reset" data-login = "'+v.login+'">更改账户信用</a></li>'+
										'<li class="divider"></li>'+
										'<li><a href="javascript:;" class="mt_del" data-login = "'+v.login+'" data-id = "'+v.uid+'"><i class="i"></i> 删除用户</a></li>'+
									'</ul>'+
								'</div>'+
				  			'</td>'+
				  		'</tr>';
			})
		}else{
			html += '<tr class="sub sub-'+id+'"><td colspan="9" style="text-align: center;">暂时没有mt4账户...</td></tr>';			
		}
		return html;
	},
	changeInmoney : function(){
		$(".mt_changeInmoney").unbind('click').bind('click',function(event){
			event.stopPropagation();
			var $o = $(this);
			var login=$o.data("login");
			var status=$o.attr("status");
			layer.confirm('确认执行该操作？',function(){
				ajaxReturn(URLchangeInmoney,{
					login : login,
					status : status
				},function(){
					layer.msg('系统处理中...',{time:10000});
				},function(data){
					if(data.status){
						Account.loadAlist();
					}else{
						layer.alert(data.info,{icon:2});
						return;
					}
				})
			})
		});
	},
	
	changeOutmoney : function(){
		$(".mt_changeOutmoney").unbind('click').bind('click',function(event){
			event.stopPropagation();
			var $o = $(this);
			var login = $o.data("login");
			var status = $o.attr("status");
			layer.confirm('确认执行该操作？',function(){
				ajaxReturn(URLchangeOutmoney,{
					login : login,
					status : status
				},function(){
					layer.msg('系统处理中...',{time:10000});
				},function(data){
					if(data.status){
						Account.loadAlist();
					}else{
						layer.alert(data.info,{icon:2});
						return;
					}
				})
			})
		});
	},
	
	changeTrades : function(){
		$(".mt_changeTrades").unbind('click').bind('click',function(event){
			event.stopPropagation();
			var $o = $(this);
			var login=$o.data("login");
			var status=$o.attr("status");
			layer.confirm('确认执行该操作？',function(){
				ajaxReturn(URLchangeTrades,{
					login : login,
					status : status
				},function(){
					layer.msg('系统处理中...',{time:10000});
				},function(data){
					if(data.status){
						Account.loadAlist();
					}else{
						layer.alert(data.info,{icon:2});
						return;
					}
				})
			})
		});
	},
	
	
}