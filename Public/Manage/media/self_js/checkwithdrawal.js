checkWithdrawal = {
	$target : null,
	pageParams : {},
	init : function(){
		this.$target = $('#tbody');
		this.laydate();
		this.pageParams.type = 0;
		this.loadList();
		this.searchEvent();
		this.batchAll();	
		$('#daterange').hover(function(){
			layer.tips('以申请时间统计', '#daterange', {
			    tips: [1, '#0FA6D8'] //还可配置颜色
			});
		})
		$('#more').bind('click',function(){
			var $o = $('#morehtml');
			if($o.is(':hidden')){
				$o.slideDown('slow');
			}else{
				$o.slideUp('slow');
			}
		})
	},

	batchAll : function(){
		$(document).on('ifChecked','#selectedAll' ,function(event){
            checkWithdrawal.$target.find('input').iCheck('check');
        }).on('ifUnchecked', '#selectedAll',function(event){
            checkWithdrawal.$target.find('input').iCheck('uncheck');
        });
		$('#batchAll').bind('click',function(){
			layer.confirm('确认批量删除吗？',function(){
				var arr = [];
				checkWithdrawal.$target.find('[type=checkbox]:checked').each(function(){
					var $o = $(this);
					var did = $o.attr('did');
					arr.push(did);
				})
				if(arr.length>0){
					ajaxReturn('delWithdrawal',{id:arr.join(',')},function(){
						layer.msg('批量删除中...');
					},function(res){
						if(res.status){
							layer.closeAll();
							checkWithdrawal.loadList();
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

	searchEvent : function(){
		var self = this;
		$('#searBtn').unbind('click').bind('click',function(){
			// self.searchEvent();
			self.loadList();
		})
	},

	buildQueryParams : function(){
		this.pageParams.type = $('[name=type]').val();
		this.pageParams.status = $('[name=status]').val();
		this.pageParams.start_time = $.trim($('#start').val());
		this.pageParams.end_time = $.trim($('#end').val());
		this.pageParams.account = $.trim($('[name=account]').val());
		this.pageParams.daterange = $('[name=daterange]').val();
		this.pageParams.gid = $('[name=group]').val();
	},
	report : function(){
		this.buildQueryParams();
		var params="status="+this.pageParams.status+"&daterange="+this.pageParams.daterange+"&gid="+this.pageParams.gid+
		"&start_time="+this.pageParams.start_time+"&end_time="+this.pageParams.end_time+"&account="+this.pageParams.account+"&type="+this.pageParams.type;
		window.location.href = reportUrl+"?"+params;
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
		var html = '';
		if(this.pageParams.type==0 || this.pageParams.type == 2){
			html += '<thead class="flip-content">'+
					  	'<tr>'+
					  		'<th><input id="selectedAll" class="i-check" type="checkbox" /></th>'+
					  		'<th>账号</th>'+
					  		'<th>姓名</th>'+
					  		'<th>余额</th>'+
					  		'<th>可用余额</th>'+
					  		'<th>银行卡</th>'+
					  		'<th>申请时间</th>'+
					  		'<th>出金</th>'+
					  		'<th>实付</th>'+
					  		'<th>审核时间</th>'+
					  		'<th>备注</th>'+
					  		'<th>操作</th>'+
					  	'</tr>'+
					'</thead><tbody>';
			for(var i=0;i<data.length;i++){
				data[i].type = data[i].type ? data[i].type : '';
				data[i].bank = data[i].bank ? data[i].bank : '';
				data[i].bankaccount = data[i].bankaccount ? data[i].bankaccount : '';
				html += '<tr bankaccount="'+data[i].bankaccount+'" bankname="'+data[i].bankname+'" type="'+(data[i].type).toUpperCase()+'">'+
					  		'<td><input did="'+data[i].id+'" class="i-check" type="checkbox" /></td>'+
					  		'<td>'+data[i].account+'</td>'+
					  		'<td>'+data[i].name+'</td>'+
					  		'<td>$'+Number(data[i].balance).toFixed(2)+'</td>'+
					  		'<td>$'+Number(data[i].margin_free).toFixed(2)+'</td>'+
					  		'<td class="bankicon">';
					  		if(data[i].bank!=''){
					  		html += '<span url="'+data[i].cardpositiveurl+'" style="cursor:pointer;" class="badge">正面</span>&nbsp;&nbsp;'+
					  			'<span url="'+data[i].cardnegativeurl+'" style="cursor:pointer;" class="badge">反面</span>'+
					  			'&nbsp;<a class="badge badge-warning bankdetail">详细</a>';
					  		}else{
					  			html += '<span class="badge badge-important">该出金银行卡已删除</span>';
					  		}
					  		html += '</td>'+
					  		'<td>'+data[i].applytime+'</td>'+
					  		'<td>$'+data[i].usdmoney+'</td>'+
					  		'<td>￥'+data[i].money+'</td>'+
					  		'<td>';
					  			if(data[i].checktime!=''){
					  				html += data[i].checktime;
					  			}else{
					  				html += '<span class="badge badge-important">未审核</span>';
					  			}
					  			
				    html += '</td>'+
					  		'<td>';
					  			if(data[i].status==2){
									html += '<span class="badge badge-important">已批回：'+data[i].reason+'</span>';
					  			}
					  			if(data[i].status==3){
									html += '<span class="badge badge-important">已退回：'+data[i].reason+'</span>';
					  			}
					html += '</td>'+
					  		'<td cid="'+data[i].id+'" type="0">';
					  			if(data[i].status==1){
					  				if(data[i]['status2'] == 0){
					  					html += '<span class="badge badge-warning">MT4处理中</span>';
					  				}else{

						  				html += '<span class="badge badge-success">已完成</span>';
						  				html += '&nbsp;<button class="btn red rollback">退回</button>';
					  				}
					  			}
					  			if(data[i].status==3){
					  				html += '<span class="badge badge-success">已完成</span>';
					  			}
					  			if(data[i].status==2){
					  			
								}
								if(data[i].status==0){

									html +=	'<button class="btn blue radius backCheck">批回</button>&nbsp;'+
										'<button onclick="payEvent('+data[i].id+','+data[i].account+',0)" class="btn green radius">审核</button>';
					  			
					  				html += '&nbsp;<button did="'+data[i].id+'" type="0" class="btn red del">删除</button>';
								}
					html += '</td>'+
					  	'</tr>';
			}
			html += '</tbody>';
		}else if(this.pageParams.type==1){
			html += '<thead class="flip-content">'+
					  	'<tr>'+
					  		'<th>持卡人姓名</th>'+
					  		'<th>账号</th>'+
					  		'<th>余额</th>'+
					  		'<th>可用余额</th>'+
					  		'<th>申请时间</th>'+
					  		'<th>出金金额</th>'+
					  		'<th>客户银行编号</th>'+
					  		'<th>开户行名称</th>'+
					  		'<th>开户行地址</th>'+
					  		'<th>Swift识别码</th>'+
					  		'<th>审核时间</th>'+
					  		'<th>备注</th>'+
					  		'<th>操作</th>'+
					  	'</tr>'+
					'</thead><tbody>';
			for(var i=0;i<data.length;i++){
				var dataremark= eval('('+data[i].remark+')');

				html += '<tr>'+
					  		'<td>'+dataremark.name+'</td>'+
					  		'<td>'+data[i].account+'</td>'+
					  		'<td>$'+Number(data[i].balance).toFixed(2)+'</td>'+
					  		'<td>$'+Number(data[i].margin_free).toFixed(2)+'</td>'+
					  		'<td>'+formatDateTime(data[i].applytime,5)+'</td>'+
					  		'<td>$'+data[i].usdmoney+'</td>'+
					  		'<td>'+dataremark.bankcode+'</td>'+
					  		'<td>'+dataremark.bankname+'</td>'+
					  		'<td>'+dataremark.bankaddress+'</td>'+
					  		'<td>'+dataremark.swift+'</td>';
					  		if(data[i].checktime!=0){
								html += '<td>'+formatDateTime(data[i].checktime,5)+'</td>';
					  		}else{
					  			html += '<td></td>';
					  		}
					  		
					html += '<td>';
					  			if(data[i].status==2){
									html += '<span class="badge badge-important">已批回：'+data[i].reason+'</span>';
					  			}
					  			if(data[i].status==3){
									html += '<span class="badge badge-important">已退回：'+data[i].reason+'</span>';
					  			}
					html += '</td>'+
					  		'<td cid="'+data[i].id+'" type="1">';
					  			if(data[i].status==1){
					  				html += '<span class="badge badge-success">已完成</span>';
					  				html += '&nbsp;<button class="btn red rollback">退回</button>';
					  			}
					  			if(data[i].status==3){
					  				html += '<span class="badge badge-success">已完成</span>';
					  			}
					  			if(data[i].status==2){
					  				html += '&nbsp;<button did="'+data[i].id+'" type="1" class="btn red mini del">删除</button>';
								}
								if(data[i].status==0){

									html +=	'<button class="btn blue radius backCheck">批回</button>&nbsp;'+
										'<button onclick="payEvent('+data[i].id+','+data[i].account+',1)" class="btn green radius">审核</button>';
					  			
					  				html += '&nbsp;<button did="'+data[i].id+'" type="1" class="btn red del">删除</button>';
								}
					html += '</td>'+
					  	'</tr>';
			}
			html += '</tbody>';
		}
		return html;
	},

	laydate : function(){
		var start = {
		    elem: '#start',
		    format: 'YYYY-MM-DD hh:mm:ss',
		    // min: laydate.now(), //设定最小日期为当前日期
		    max: '2099-06-16 23:59:59', //最大日期
		    istime: true,
		    istoday: false,
		    choose: function(datas){
		         end.min = datas; //开始日选好后，重置结束日的最小日期
		         end.start = datas //将结束日的初始值设定为开始日
		    }
		};
		var end = {
		    elem: '#end',
		    format: 'YYYY-MM-DD hh:mm:ss',
		    min: laydate.now(),
		    max: '2099-06-16 23:59:59',
		    istime: true,
		    istoday: false,
		    choose: function(datas){
		        start.max = datas; //结束日选好后，重置开始日的最大日期
		    }
		};
		laydate(start);
		laydate(end);
	},

	handle : function(){
		$('.bankicon span').bind('click',function(){
			var url = $(this).attr('url');
			layer.open({
			    type: 1,
			    title : false,
			    skin: 'layui-layer-demo', //样式类名
			    closeBtn: 0, //不显示关闭按钮
			    shift: 1,
			    area: ['505px', '320px'],
			    shadeClose: true, //开启遮罩关闭
			    content: '<img src="'+url+'">'
			});
		});
		$('.backCheck').bind('click',function(){
			var $self = $(this).parent();
			var cid = $self.attr('cid');
			var type = $self.attr('type');
			layer.prompt({title: '审核不过原因', formType: 2}, function(text){
				ajaxReturn(recordReason,
					{
						reason:text,
						id:cid,
						status:2,
						type : type
					},function(){
					layer.msg('提交中...');
				},function(res){
					layer.closeAll();
					if(res.status){
						checkWithdrawal.loadList()
					}else{
						layer.alert(res.info,{icon:2})
					}
				})
		        
		    });
		})
		$('.del').bind('click',function(){
			var did = $(this).attr('did');
			var type = $(this).attr('type');
			layer.confirm('确认删除？',function(){
				ajaxReturn("delWithdrawal",{
					id:did,
					type : type
				},function(){
					layer.msg('系统处理中...');
				},function(res){
					if(res.status){
						layer.closeAll();
						checkWithdrawal.loadList();
					}else{
						layer.alert(res.info,{icon:2});
						return;
					}
				})
			})
		})
		$('.bankdetail').unbind('click').bind('click',function(){
			var $o = $(this).parents('tr');
			var bankname = $o.attr('bankname')
			var bankaccount = $o.attr('bankaccount')
			var type = $o.attr('type')
			var html = '<div style="width:480px" class="form-horizontal">'+
						  '<div class="control-group">'+
						    '<label class="col-sm-4 control-label">类型：</label>'+
						    '<div class="col-sm-6" style="margin-top:8px">'+type+'</div>'+
						  '</div>'+
						  '<div class="control-group">'+
						    '<label class="col-sm-4 control-label">银行：</label>'+
						    '<div class="col-sm-6" style="margin-top:8px">'+bankname+'</div>'+
						  '</div>'+
						  '<div class="control-group">'+
						    '<label class="col-sm-4 control-label">账户-账号：</label>'+
						    '<div class="col-sm-6" style="margin-top:8px">'+bankaccount+'</div>'+
						  '</div>'+
						'</div>';
			layer.open({
			    type: 1,
			    title : '银行卡信息',
			    skin: 'layui-layer-demo', //样式类名
			    closeBtn: 0, //不显示关闭按钮
			    shift: 1,
			    area: ['505px', '320px'],
			    shadeClose: true, //开启遮罩关闭
			    content: html
			});
		})

		$('.rollback').unbind('click').bind('click',function(){
			var $self = $(this).parent();
			var id = $self.attr('cid');
			var type = $self.attr('type');
			var html = '<div style="width:480px" class="form-horizontal">'+
						  '<div class="form-group">'+
						    '<label class="col-sm-4 control-label">金额：</label>'+
						    '<div class="col-sm-6" style="margin-top:8px">'+
						    	'<input type="text" name="amount" class="form-control">'+	
						    '</div>'+
						  '</div>'+
						  '<div class="form-group">'+
						    '<label class="col-sm-4 control-label">原因：</label>'+
						    '<div class="col-sm-6" style="margin-top:8px">'+
						    	'<textarea name="text" class="form-control"></textarea>'+
						    '</div>'+
						  '</div>'+
						  '<div class="form-group">'+
						    '<div class="col-sm-offset-6 col-sm-4" style="margin-top:8px">'+
						    	'<button id="rollbackbtn" class="btn btn-success">确定</button>'
						    '</div>'+
						  '</div>'+
						'</div>';
			layer.open({
			    type: 1,
			    title : '退回金额',
			    skin: 'layui-layer-demo', //样式类名
			    closeBtn: 0, //不显示关闭按钮
			    shift: 1,
			    area: ['495px', '280px'],
			    shadeClose: true, //开启遮罩关闭
			    content: html
			});
			$('#rollbackbtn').unbind('click').bind('click',function(){
				layer.confirm('确认退回金额？',function(){
					ajaxReturn('rollback',{
						id : id,
						type : type,
						amount : $.trim($('[name=amount]').val()),
						text : $.trim($('[name=text]').val())
					},function(){
						layer.msg('系统处理中...',{time:50000})
					},function(res){
						layer.closeAll();
						if(res.status){
							layer.alert(res.info,{icon:1})
							checkWithdrawal.loadList();
						}else{
							layer.alert(res.info,{icon:2})
						}
					})
				})
			})
			
			
		})
	}
}
function payEvent(id,account,type){
	layer.confirm('确认审核通过？<br/>系统将从mt4账号扣除相应的出金金额',function(){
		ajaxReturn('sureWithdrawal',
			{id:id,type:type},
		function(){
			layer.msg('系统处理中...');
		},function(res){
			if(res.status){
				layer.msg('审核通过',{icon:1})
				checkWithdrawal.loadList();
				ajaxReturn('senEmailToUser',{
					id : id,
					account : account
				},null,null)
			}else{
				layer.alert(res.info,{icon:2});
			}
		})
	})
}