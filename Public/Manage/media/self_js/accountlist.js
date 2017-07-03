Account = {

	init : function(){
		this.params = {}
		this.$target = $('#tbody');
		this.$page = $('#page');
		this.params.loadgroup=1;
		this.importMt4();
		this.loadAlist();
		delete(this.params.loadgroup);
		this.searchEvent();
		this.pageEvent();
	},
	importMt4 : function(){
		$('.import-mt4').click(function() {
			ajaxReturn('getUserTypeConfig',{},null,function(res){
				if(res.status){
					var html = 	'<div class="alert">'+
									'如果系统账户有同邮箱的,MT4账号就挂在系统账户下;如果没有系统账户,就创建一个系统账户,并挂在该系统账户下。'+
								'</div>'+
								'<div class="form-horizontal">'+
									'<div class="control-group">'+
										'<label class="control-label">新系统账户初始密码:</label>'+
										'<div class="controls">'+
											'<input type="text" class="m-wrap"  name="mainpwd" placeholder="不填，默认为:abcd8888">'+
										'</div>'+
									'</div>'+

									'<div class="control-group">'+
										'<label class="control-label">新系统账户统一类型:</label>'+
										'<div class="controls">'+
											'<select class="m-wrap" name="user_type">';
												for (var i = 0; i < res.info.length; i++) {
													html+='<option value="'+i+'">'+res.info[i]['title']+'</option>';
												};
											html+='</select>'+
										'</div>'+
									'</div>'+
								'</div>';
					layer.open({
					    title : '导入MT4账号到系统账户',
					    skin: 'layui-layer-molv', //样式类名
					    closeBtn: 0, //不显示关闭按钮
					    shift: 1,
					    area:'500px',
					    shadeClose: true, //开启遮罩关闭
					    content: html,
					    yes:function(){
							var mainpwd = $.trim($('[name=mainpwd]').val());
							var user_type = $('[name=user_type]').val();
							layer.confirm('确定导入?',
								function(){
									ajaxReturn('importMt4',{mainpwd:mainpwd,user_type:user_type},function(){
										layer.msg('导入中，请耐心等待...');
									},function(res){
										if(res.status){
											layer.closeAll();
											layer.msg(res.info,{icon:1});
											setTimeout(function(){
												Account.loadAlist();
											},3000);
										}else{
											layer.alert(res.info,{icon:2})

										}
									})
								}
							)
					    }
					});
				}else{
					layer.alert(res.info,{icon:2})
				}
			})
			
			
			
		});
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
			Account.params.gid=$('[name=gid] option:selected').val();
			Account.params.account = $.trim($('[name=account]').val());
			Account.params.sscont = $.trim($('[name=sscont]').val());
			Account.params.sstype = $('[name=sstype] option:selected').val();
			Account.params.status = $('[name=status] option:selected').val();
			Account.loadAlist();
		})
		$(document).on('keypress','[name=sscont]',function(event){
            if(event.keyCode == "13")    
            {
            	Account.params.gid=$('[name=gid] option:selected').val();
                Account.params.account = $.trim($('[name=account]').val());
                Account.params.sscont = $.trim($('[name=sscont]').val());
                Account.params.sstype = $('[name=sstype] option:selected').val();
				Account.params.status = $('[name=status] option:selected').val();
				Account.loadAlist();
            }
        });
	},
	bindEvent : function(){	
		this.bankicon();
		this.active();
		this.repeatemail();
		this.refuse();
		this.notpass();
		this.touser();
		this.delUser();
		this.resetApwd();
		this.changeGroup();	
		// this.changeProxy();		
		this.changeUserType();
		this.loadMtlist();
		this.editAccount();
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
		this.changeAid();
	},

	resetApwd : function(){
		$('.reset').unbind('click').bind('click',function(event){
			event.stopPropagation();
			var id=$(this).data("id");
			layer.confirm('确认重置密码?',function(){
				ajaxReturn("resetApwd",{
					id:id
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

	resetMtpwd : function(){
		$('.mt_reset').unbind('click').bind('click',function(event){
			//console.log('123');
			event.stopPropagation();
			var login=$(this).data("login");
			layer.confirm('确认重置密码?',function(){
				ajaxReturn("resetMtpwd",{
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

	active : function(){
		$(".check").unbind('click').bind('click',function(event){
			event.stopPropagation();
			var id=$(this).data("id");
			var email = $.trim($(this).parents('tr').find('.emailclass').text());
			layer.confirm('确认激活？',function(){
				ajaxReturn("activeUser",{
					id:id
				},function(){
					layer.msg('激活中...');
				},function(res){
					if(res.status){
						layer.closeAll();
						$(".btn"+id).remove();
						$("#notactive"+id).html("<span class='badge badge-success'>已激活</span>");
						ajaxReturn("sendEmailToUser",{
							email : email,
							id: id
						},null,null);
					}else{
						layer.alert(res.info,{icon:2});
						return;
					}
				})
			})
		});
	},
	repeatemail : function(){
		$('.repeatemail').unbind('click').bind('click',function(){
			var email = $(this).data('email');
			var id = $(this).data('id');
			if(email==''){
				layer.alert('没有邮箱地址',{icon:2})
				return false;
			}
			ajaxReturn("sendEmailToUser",{
				email : email,
				id: id
			},function(){
				layer.msg('发送中...',{time:50000000});
			},function(res){
				if(res.status){
					layer.msg('发送成功')
				}else{
					layer.alert('发送失败',{icon:2})
				}
			});
		})
	},
	mtActive : function(){
		$(".mt_active").unbind('click').bind('click',function(event){
			event.stopPropagation();
			var self = this;
			var login=$(this).data("login");
			var email=$(this).data("email");
			var id=$(this).data("id");
			layer.confirm('确认审核？',function(){
				ajaxReturn("activeMtuser",{
					login:login
				},function(){
					layer.msg('激活中...');
				},function(res){
					if(res.status){
						layer.closeAll();
						$(self).remove();
						$("#mtnotactive"+id).html("<span class='badge badge-success'>已审核</span>");
						ajaxReturn("sendEmailToUser",{
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

	refuse : function(){
		$('.refuse').unbind('click').bind('click',function(event){
			event.stopPropagation();
			var email=$(this).data("email");
			var id=$(this).data("id");
			layer.prompt({title: '审核不过原因', formType: 2}, function(text){
				ajaxReturn("sendback",{
					reason:text,
					email:email,
					id:id
				},function(){
					layer.msg('提交中...');
				},function(res){
					layer.closeAll();
					if(res.status){
						$(".btn"+id).remove();
						$("#notactive"+id).html('<a class="notpass" data-reason='+text+' style="cursor:pointer">未通过</a>');
						layer.alert("批回成功");
						$('.notpass').on('click',function(){
							layer.alert($(this).data("reason"),{title :'批回原因'});
						});
					}else{
						layer.alert(res.info,{icon:2});
					}
					
				})
		        
		    });
		});
	},

	delUser : function(){		
		$('.del').unbind('click').bind('click',function(event){
			event.stopPropagation();
			var id=$(this).data("id");
			var message = '考虑到安全性，请先删除该账户名下所有MT4账户'
			layer.confirm(message,{
				 btn: ['确定删除','取消'] 
			},function(){
				ajaxReturn("delUser",{
					id : id
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

	delMtuser : function(){		
		$('.mt_del').unbind('click').bind('click',function(event){
			event.stopPropagation();
			var id=$(this).data("id");
			var login=$(this).data("login");
			var message = '考虑到安全性，系统只清除该账户在本系统的资料并在mt4中禁用本账号，如需完全删除请到mt4中操作'
			layer.confirm(message,{
				 btn: ['确定删除','取消'] 
			},function(){
				ajaxReturn("delMtuser",{
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
			var url = 'lists';
		}
		ajaxReturn(url,this.params,function(){
			layer.msg('努力加载中...',{time:5000000})
		},function(res){
			// console.log(res);return
			if(res.status){
				layer.closeAll();
				if(res.info.alltype!=null){
					var typehtml = '<option>所有</option>';

					Account.grouplist = res.info.alltype;
					$.each(Account.grouplist ,function(index, el) {
						typehtml += '<option value='+index+'>'+el["title"]+'</option>';
					});
					$('[name=gid]').html(typehtml);
				}
				Account.$target.empty().html(Account.alist(res.info.list));
				Account.$page.html(res.info.page);				
				Account.bindEvent();
			}else{
				layer.alert(res.info,{icon:2})
			}
		})
	},

	loadMtlist:function(){
		$('.showmt').unbind('click').bind('click', function() {
			var id = $(this).data('id');
			var groups = $(this).data('groups');
			var email = $(this).data('email');
			var self = this;
			if($(self).parents('tr').next().hasClass('sub-'+id)){
				$(self).empty().html('<i class="icon-chevron-down"></i></span>');
				$('.sub-'+id).remove();
			}else{
				$(self).empty().html('<i class="icon-chevron-up"></i>');
				$(self).parents('tr').siblings('.sub').remove();
				$(self).parents('tr').siblings().find('.showmt').html('<i class="icon-chevron-down"></i></span>');
				ajaxReturn('mtlists',{aid:id},function(){
					layer.msg('努力加载中...',{time:5000000})
				},function(res){
					if(res.status){
						layer.closeAll();
						$(self).parents('tr').after(Account.mtlist(res.info.list,id,groups,email));
						Account.bindmtEvent();
					}else{
						layer.alert(res.info,{icon:2})
					}
				})
			}
			
		});
		
	},
	changeUserType:function(){
		$('.changeUserType').unbind('click').bind('click', function(event) {
			var id = $(this).data('id');
			var name = $(this).data('name');
			var type = $(this).data('type');
			ajaxReturn('getUserTypeConfig',{},null,function(res){
				if(res.status){
					var html = '<div class="form-horizontal">'+
								'<div class="control-group">'+
									'<label class="control-label"><strong>'+name+'</strong>的当前用户类型:</label>'+
									'<div class="controls">'+
										'<span class="text bold">'+type+'</span>'+
									'</div>'+
								'</div>'+
								'<div class="control-group">'+
									'<label class="control-label"> 更改为:</label>'+
									'<div class="controls">'+
										'<select class="small m-wrap" name="userType">';
											for (var i = 0; i < res.info.length; i++) {
												html+='<option value="'+i+'">'+res.info[i]['title']+'</option>';
											};
									
										html+='</select>'+	
									'</div>'+
								'</div>'+
							'</div>';
					layer.open({
					    title : '更改用户账户类型',
					    skin: 'layui-layer-molv', //样式类名
					    closeBtn: 0, //不显示关闭按钮
					    shift: 1,
					    shadeClose: true, //开启遮罩关闭
					    content: html,
					    yes:function(){
					    	var newtype = $.trim($('[name=userType]').val());
							layer.confirm('确定更改?',function(){
								ajaxReturn('changeUserType',{id:id,newtype:newtype},function(){
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
				}else{
					layer.alert(res.info,{icon:2});
				}
			})
		});
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
						'<label class="control-label"> 增加或减少余额:</label>'+
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
						ajaxReturn('changeBalance',{login:login,newbalance:newbalance},function(){
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
	changeAid : function(){
		$('.mt_changeaid').unbind('click').bind('click',function(event){
			event.stopPropagation();
			var id=$(this).data("id");
			var login=$(this).data("login");
			var aid = $(this).data('aid');
			var html = '<div class="form-horizontal">'+
					'<div class="control-group">'+
						'<label class="control-label"><strong>'+login+'</strong>的原主账号ID:</label>'+
						'<div class="controls">'+
							'<span class="text bold">'+aid+'</span>'+
						'</div>'+
					'</div>'+
					'<div class="control-group">'+
						'<label class="control-label"> 更改为:</label>'+
						'<div class="controls">'+
							'<input type="text" class="m-wrap small"  name="newaid" placeholder="请输新主账号ID号">'+
						'</div>'+
					'</div>'+
				'</div>';
			layer.open({
			    title : '交易账号过户',
			    skin: 'layui-layer-molv', //样式类名
			    closeBtn: 0, //不显示关闭按钮
			    shift: 1,
			    shadeClose: true, //开启遮罩关闭
			    content: html,
			    yes:function(){
					var newaid = $.trim($('[name=newaid]').val());
					layer.confirm('确定更改?',function(){
						ajaxReturn('changeAid',{id:id,newaid:newaid},function(){
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
	editAccount:function(){
		var self=this;
		$('.editAccount').unbind('click').bind('click',function(){
			var id = $(this).data('id');
			ajaxReturn('userInfo',{id:id},null,function(res){
				if(res.status){
					var data = res.info;
					var html = '<div class="row-fluid">'+
							'<div class="span12">'+
								'<div class="tabbable tabbable-custom">'+
									// '<ul class="nav nav-tabs">'+
									// 	'<li class="active"><a href="#tab_1_1" data-toggle="tab">基本资料</a></li>'+
									// 	'<li class=""><a href="#tab_1_2" data-toggle="tab">银行卡信息</a></li>'+
									// '</ul>'+
									'<div class="tab-content">'+
										'<div class="tab-pane active" id="tab_1_1">'+
											'<form class="form-horizontal" action="#" id="uploadForm" method="post">'+
												'<input type="hidden" name="id" value='+id+'>'+
												'<div class="row-fluid">'+
													'<div class="span6 ">'+
														'<div class="control-group">'+
															'<label class="control-label">姓名：</label>'+
															'<div class="controls">'+
																'<input type="text" class="m-wrap span12" value="'+data.name+'" name="name">'+
																'<span class="help-block"></span>'+
															'</div>'+
														'</div>'+
													'</div>'+
													'<div class="span6 ">'+
														'<div class="control-group">'+
															'<label class="control-label">证件号码：</label>'+
															'<div class="controls">'+
																'<input type="text" class="m-wrap span12" value="'+data.idcardnumber+'" name="idcardnumber">'+
																'<span class="help-block"></span>'+
															'</div>'+
														'</div>'+
													'</div>'+
												'</div>'+
												'<div class="row-fluid">'+
													'<div class="span6 ">'+
														'<div class="control-group">'+
															'<label class="control-label">手机：</label>'+
															'<div class="controls">'+
																'<input type="text" class="m-wrap span12" value="'+data.phone+'" name="phone">'+
																'<span class="help-block"></span>'+
															'</div>'+
														'</div>'+
													'</div>'+
													'<div class="span6 ">'+
														'<div class="control-group">'+
															'<label class="control-label">邮箱：</label>'+
															'<div class="controls">'+
																'<input type="text" class="m-wrap span12" value="'+data.email+'" name="email">'+
																'<span class="help-block"></span>'+
															'</div>'+
														'</div>'+
													'</div>'+
												'</div>'+
												'<div class="row-fluid">'+
													'<div class="span6 ">'+
														'<div class="control-group">'+
															'<label class="control-label">住址：</label>'+
															'<div class="controls">'+
																'<input type="text" class="m-wrap span12" value="'+data.addressstreet+'" name="addressstreet">'+
																'<span class="help-block"></span>'+
															'</div>'+
														'</div>'+
													'</div>'+
													// '<div class="span6 ">'+
													// 	'<div class="control-group">'+
													// 		'<label class="control-label">父级代理ID：</label>'+
													// 		'<div class="controls">'+
													// 			'<input type="text" class="m-wrap span12" placeholder="xxxx">'+
													// 			'<span class="help-block"></span>'+
													// 		'</div>'+
													// 	'</div>'+
													// '</div>'+
												'</div>'+
												'<div class="row-fluid">'+
													'<div class="span6 ">'+
														'<div class="control-group">'+
															'<label class="control-label">账户类型：</label>'+
															'<div class="controls">'+
																'<select class="m-wrap span12" name="user_type">';
																	for (var i = 0; i < data.typeconfig.length; i++) {
																		html+='<option value="'+i+'">'+data.typeconfig[i]['title']+'</option>';
																	};
																html+='</select>'+
															'</div>'+
														'</div>'+
													'</div>'+
												'</div>'+
												'<div class="row-fluid">'+
													'<div class="span6 ">'+
														'<div class="control-group">'+
															'<input type="hidden" value="'+data.cardpositive+'" name="cardpositive">'+
															'<input type="hidden" value="'+data.cardnegative+'" name="cardnegative">'+
															'<label class="control-label">身份证正面：</label>'+
															'<div class="controls">'+
																'<div id="idTopList" class="uploader-list">'+
																	'<div class="file-item thumbnail"><img src="'+rooturl+data.cardpositive+'"></div>'+
																'</div>'+
																'<div id="idPickerTop">选择正面</div>'+
															'</div>'+
														'</div>'+
													'</div>'+
													'<div class="span6 ">'+
														'<div class="control-group">'+
															'<label class="control-label">身份证反面：</label>'+
															'<div class="controls">'+
																'<div id="idBotList" class="uploader-list">'+
																	'<div class="file-item thumbnail"><img src="'+rooturl+data.cardnegative+'"></div>'+
																'</div>'+
																'<div id="idPickerBot">选择反面</div>'+
															'</div>'+
														'</div>'+
													'</div>'+
												'</div>'+
												'<div class="row-fluid">'+
													'<div class="span12">'+
														'<div class="control-group">'+
															'<label class="control-label span6">同步到该系统账户的所有MT4账号：</label>'+
															'<div class="controls span6">'+
																'<label class="checkbox">姓名<input type="checkbox" name="samename">&nbsp;&nbsp;</label>'+
																'<label class="checkbox">手机<input type="checkbox" name="samephone">&nbsp;&nbsp;</label>'+
																'<label class="checkbox">邮箱<input type="checkbox" name="samemail">&nbsp;&nbsp;</label>'+
															'</div>'+
														'</div>'+
													'</div>'+
												'</div>'+
											'</form>'+
										'</div>'+
										// '<div class="tab-pane" id="tab_1_2">'+
										// 	'<p>in Section 2.</p>'+
										// '</div>'+
									'</div>'+
								'</div>'+
							'</div> '+
						'</div>';
						
			layer.open({
				title : '编辑用户资料',
				area : '800px',
			    skin: 'layui-layer-molv', //样式类名
			    btn: ['确定提交', '取消提交'], //只是为了演示
			    shift: 1,
			    shadeClose: true, //开启遮罩关闭
			    content: html,
			    success:function(){
			    	$('[name="user_type"]').val(data.user_type);
					cardUpload('#idPickerTop','#idTopList','cardpositive');
					cardUpload('#idPickerBot','#idBotList','cardnegative');
			    },
			    yes:function(){	
			    	var formData = new FormData($( "#uploadForm" )[0]); 
					layer.confirm('确定更改?',function(){	
			        	$.ajax({  
				          	url: 'editUserInfo' ,  
				          	type: 'POST',  
				          	data: formData,  
				          	async: false,  
				          	cache: false,  
				          	contentType: false,  
				          	processData: false,
				          	beforeSend : function(){
				          			layer.msg('系统处理中...');
				          	},
				          	success: function (res) { 
				          		console.log(res);
				          		if(res['status']){
				          			layer.msg(res.info,{icon:1});
									setTimeout(function(){
										Account.loadAlist();
									},3000);
				          		}else{
				          			layer.alert(res.info);
				          		}
				          	},  
				          	error: function (res) {  
				          		//code
				          	}  
					    });
					})
			    }
			});
				}else{
					layer.alert(res.info,{icon:2});
					return false;
				}
			})
			
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
				  			'<td>'+v.id+'</td>'+
				  			'<td>'+v.name+'&nbsp;<span class="badge badge-warning showmt" style="cursor:pointer" data-allmt="'+v.allmt+'" data-id = "'+v.id+'" data-groups="'+v.type.group+'" data-email="'+v.email+'">'+
				  			'<i class="icon-chevron-down"></i></span>'+
				  			'<span class="badge badge-important">';
				  			if(v.nocheck>0){
								html+='<i class="icon-eye-open"></i> ';
				  			}
				  			html+=v.allmt+'</span></td>'+
				  			'<td><span class="badge badge-info">'+v.type.title+'</span></td>'+
				  			'<td>'+v.phone+'</td><td class="emailclass">'+v.email+'</td>'+
				  			'<td class="bankicon">'+
				  				'<span class="badge" style="cursor:pointer;" url="'+rooturl+v.cardpositive+'">正面</span>&nbsp;&nbsp;'+
				  				'<span class="badge" style="cursor:pointer;" url="'+rooturl+v.cardnegative+'">反面</span>'+
				  			'</td>'+
				  			'<td id="notactive'+v.id+'">';
			  				if(v.status == 1){
					  			html += '<span class="badge badge-success">已激活</span>';
					  		}else if(v.status == 2){
					  			html += '<a data-reason="'+v.reason+'" class="badge badge-warning notpass" style="cursor:pointer">未通过</a>';
					  		}else{
					  			html += '<span class="badge badge-important">未激活</span>';
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
				  				if(v.status == 0){
				  					html += '<button class="btn blue btn'+v.id+' refuse" data-id = "'+v.id+'" data-email = "'+v.email+'" style="vertical-align:top;">批回</button>&nbsp;'+
				  					'<button class="btn green btn'+v.id+' check" data-id = "'+v.id+'" style="vertical-align:top;">激活</button>&nbsp;';
				  				}
				  		html+='<button class="btn yellow touser" style="vertical-align:top;" data-name="'+v.name+'" data-id = "'+v.id+'">用户系统</button>&nbsp;'+
				  				'<div class="btn-group">'+
									'<a class="btn red" href="#" data-toggle="dropdown">'+
									'<i class="icon-user"></i> 更多'+
									'<i class="icon-angle-down"></i>'+
									'</a>'+
									'<ul class="dropdown-menu">'+
										'<li><a href="javascript:;" class="editAccount"  data-id="'+v.id+'" data-type="'+v.type.title+'">编辑资料</a></li>'+
										'<li><a href="'+editBankUrl+'?aid='+v.id+'" target="_blank"  data-id="'+v.id+'" data-type="'+v.type.title+'">编辑银行卡</a></li>'+
										'<li><a href="javascript:;" class="changeUserType" data-id="'+v.id+'" data-name="'+v.name+'" data-type="'+v.type.title+'">更改账户类型</a></li>'+
										'<li><a href="javascript:;" class="reset" data-id = "'+v.id+'">重置密码</a></li>'+
										// '<li><a href="javascript:;" class="changeProxy" data-id="'+v.id+'" data-fid="'+v.fid+'" data-name="'+v.name+'">更改父级代理</a></li>'+
										'<li><a href="javascript:;" class="repeatemail" data-id = "'+v.id+'" data-email="'+v.email+'">重发激活邮件</a></li>'+
										'<li class="divider"></li>'+
										'<li><a href="javascript:;" class="del" data-id = "'+v.id+'"><i class="i"></i> 删除用户</a></li>'+
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

				html += '<tr class="sub sub-'+id+'">'+
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
										'<li><a href="javascript:;" class="mt_changeaid" data-login = "'+v.login+'" data-id = "'+v.uid+'" data-aid = "'+v.aid+'"><i class="i"></i>账号过户</a></li>'+
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
	alisub : function(list){
		if(typeof level == 'undefined'){
			var level = 0;
		}
		var html = '';
		if(list.length>0){
			$.each(list,function(k,v){
				v.balance = '';
				html += '<tr class="sub sub-'+v.aid+'">'+
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
										'<li><a href="javascript:;" class="mt_changeGroup" data-login = "'+v.login+'" data-group="'+v.b_group+'" data-groups="'+v.allgroup.group+'">移动到组</a></li>';
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
	changeInmoney : function(){
		$(".mt_changeInmoney").unbind('click').bind('click',function(event){
			event.stopPropagation();
			var $o = $(this);
			var login=$o.data("login");
			var status=$o.attr("status");
			layer.confirm('确认执行该操作？',function(){
				ajaxReturn("changeInmoney",{
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
				ajaxReturn("changeOutmoney",{
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
				ajaxReturn("changeTrades",{
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
			    area: ['auto','50%'],
			    shadeClose: true, //开启遮罩关闭
			    content: '<img style="width:600px;height:100%" src="'+url+'">'
			});
		});
	},
	
	notpass : function(){
		$('.notpass').on('click',function(event){
			event.stopPropagation();
			layer.alert($(this).data("reason"),{title :'批回原因'});
		});
	},
	
	touser : function(){
		$('.touser').unbind('click').bind('click',function(event){
			event.stopPropagation();
			var name=$(this).data("name");
			var id=$(this).data("id");
			ajaxReturn("toUser",{
				id:id
			},null,function(res){
				if(res.status){
					window.open(home);
				}else{
					layer.alert(res.info,{icon:2});
					return;
				}
			})
		});
	},
	
	changeGroup : function(){
		$('.changeGroup').unbind('click').bind('click',function(event){
			event.stopPropagation();
			var id=$(this).data("id");
			var default_group=$(this).data("default_group");
			var login=$(this).data("login");
			var html = '<div class="col-md-12" style="padding:20px 40px;"><div class="form-inline">'+
						  '<div class="form-group">'+
						    '<select name="cgroup" class="form-control">'+Account.grouplist+'</select>'+
						  '</div>'+
						  '&nbsp;&nbsp;&nbsp;<button aid="'+id+'" class="btn btn-success sureGroup">确定</button>'+
						'</div></div>';
			layer.open({
			    type: 1,
			    title : '移动到组',
			    skin: 'layui-layer-molv', //样式类名
			    closeBtn: 0, //不显示关闭按钮
			    shift: 1,
			    shadeClose: true, //开启遮罩关闭
			    content: html
			});
			$('.sureGroup').bind('click',function(){
				var id = $(this).attr('aid');
				var $select = $('[name=cgroup] option:selected');
				var gid = $select.val();
				var group = $select.text();
				var mt4group = $select.attr('mt4group');
				layer.confirm('确定移动到'+group,function(){
					ajaxReturn('changeGroup',{
						id:id,gid:gid,
						mt4group:mt4group,
						login : login,
						default_group : default_group
					},function(){
						layer.msg('系统处理中...');
					},function(res){
						if(res.status){
							setTimeout(function(){
								Account.loadAlist();
							},3000);
						}else{
							layer.alert(res.info,{icon:2});
						}
					})
				})
			})
		})
	},
	

	
/*	changeProxy : function(){
		$('.changeProxy').unbind('click').bind('click',function(event){
			event.stopPropagation();
			var id=$(this).data("id");
			var name=$(this).data("name");
			var fid=$(this).data("fid");
			var html = '<div class="form-horizontal">'+
							'<div class="control-group">'+
								'<label class="control-label"><strong>'+name+'</strong>的父级代理ID:</label>'+
								'<div class="controls">'+
									'<span class="text bold">'+fid+'</span>'+
								'</div>'+
							'</div>'+
							'<div class="control-group">'+
								'<label class="control-label"> 更改为:</label>'+
								'<div class="controls">'+
									'<input type="text" class="m-wrap small" placeholder="填写代理ID" name="newfid">'+
								'</div>'+
							'</div>'+
						'</div>';
					layer.open({
					    title : '此代理为本系统注册账号代理',
					    skin: 'layui-layer-molv', //样式类名
					    closeBtn: 0, //不显示关闭按钮
					    shift: 1,
					    shadeClose: true, //开启遮罩关闭
					    content: html,
					    yes:function(){
					    	var newfid = $.trim($('[name=newfid]').val());
							layer.confirm('确定更改?',function(){
								ajaxReturn('changeProxy',{id:id,fid:newfid},function(){
									layer.msg('系统处理中...');
								},function(res){
									if(res.status){
										Account.loadAlist();
									}else{
										layer.alert(res.info,{icon:2});
									}
								})
							})
					    }
					});
		})
	},*/
	
}