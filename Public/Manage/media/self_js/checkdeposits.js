checkDeposits = {
	$target : null,
	pageParams : {},
	type : 0,
	init : function(){
		this.$target = $('#tbody');
		this.$header = $('#thead');
		this.laydate();
		this.loadList();
		this.searchEvent();	
		this.tipsEvent();
        this.batchAll();
	},

	
	batchAll : function(){
		$(document).on('ifChecked','#selectedAll' ,function(event){
            checkDeposits.$target.find('input').iCheck('check');
            // console.log(111)
        }).on('ifUnchecked', '#selectedAll',function(event){
            checkDeposits.$target.find('input').iCheck('uncheck');
        });
		$('#batchAll').bind('click',function(){
			layer.confirm('确认批量删除吗？',function(){
				var arr = [];
				checkDeposits.$target.find('tbody [type=checkbox]:checked').each(function(){
					var $o = $(this);
					var did = $o.attr('did');
					arr.push(did);
				})
				if(arr.length>0){
					ajaxReturn('delDeposits',{id:arr.join(',')},function(){
						layer.msg('批量删除中...');
					},function(res){
						if(res.status){
							layer.closeAll();
							checkDeposits.loadList();
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

	tipsEvent : function(){
		$('#daterange').hover(function(){
			layer.tips('以入金成功时间统计', '#daterange', {
			    tips: [1, '#0FA6D8'] //还可配置颜色
			});
		})
		// $('#group').hover(function(){
		// 	layer.tips('组', '#group', {
		// 	    tips: [1, '#0FA6D8'] //还可配置颜色
		// 	});
		// })
		$('#admincheck').hover(function(){
			layer.tips('是否审核', '#admincheck', {
			    tips: [1, '#0FA6D8'] //还可配置颜色
			});
		})
		$('#status').hover(function(){
			layer.tips('是否支付', '#status', {
			    tips: [1, '#0FA6D8'] //还可配置颜色
			});
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
		this.pageParams.admincheck = $('[name=admincheck]').val();
		this.pageParams.daterange = $('[name=daterange]').val();
		this.pageParams.gid = $('[name=group]').val();
		this.pageParams.start_time = $.trim($('#start').val());
		this.pageParams.end_time = $.trim($('#end').val());
		this.pageParams.account = $.trim($('[name=account]').val());
		this.pageParams.aat = $("#aat option:selected").val();
	},
	report : function(){
		this.buildQueryParams();
		var params="status="+this.pageParams.status+"&admincheck="+this.pageParams.admincheck+"&type="+this.pageParams.type+"&daterange="+
		this.pageParams.daterange+"&gid="+this.pageParams.gid+"&start_time="+this.pageParams.start_time+"&end_time="+
		this.pageParams.end_time+"&account="+this.pageParams.account;
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
		if(this.pageParams.type ==0 || this.pageParams.type == 2){
			var html = '<thead class="flip-content"><tr>'+
				  		'<th><input id="selectedAll" class="i-check" type="checkbox" /></th>'+
				  		'<th>账号</th>'+
				  		'<th>姓名</th>'+
				  		'<th>账户余额</th>'+
				  		'<th>入金金额（$）</th>'+
				  		'<th>入金金额（￥）</th>'+
				  		'<th>申请时间</th>'+
				  		'<th>成功时间</th>'+
				  		'<th>单号</th>'+
				  		'<th>银行</th>'+
				  		'<th>支付平台</th>'+
				  		'<th>状态</th>'+
				  		'<th>操作</th>'+
				  	'</tr></thead><tbody>';
			for(var i=0;i<data.length;i++){
				html += '<tr>'+
							'<td><input did="'+data[i].id+'" class="i-check" type="checkbox" /></td>'+
					  		'<td>'+data[i].account+'</td>'+
					  		'<td>'+data[i].name+'</td>'+
					  		'<td>$'+data[i].balance+'</td>'+
					  		'<td>$'+data[i].usdamount+'</td>'+
					  		'<td>￥'+data[i].amount+'</td>'+
					  		'<td>'+formatDateTime(data[i].indate,5)+'</td>'+
					  		'<td>';
					  			if(data[i].successtime!=0){
					  				html += formatDateTime(data[i].successtime,5);
					  			}
					  		html += '</td>'+
					  		'<td>'+data[i].billno+'</td>'+
					  		'<td>'+data[i].bank+'</td>'+
					  		'<td>'+data[i].payname+'</td>'+
					  		'<td>';
					  		if(data[i].status=='1'){
					  			html += '<span class="badge badge-success">支付成功</span>';
					  		}else{
					  			html += '<span class="badge badge-important">未支付</span>';
					  		}
					  		html += '</td><td>';
					  			if(data[i].admincheck=='1'){
						  			html += '<span class="badge badge-info">已审核</span>';
						  		}else{
						  			html += '<button did="'+data[i].id+'" class="btn green radius btn-sm sure">审核</button>';
						  		}
					  			html += '&nbsp;<button did="'+data[i].id+'" class="btn red radius btn-sm del">删除</button>'+
					  		'</td>'+
					  	'</tr>';
			}
			html += '</tbody>';
		}else{
			var html = '<thead class="flip-content"><tr>'+
				  		'<th><input id="selectedAll" class="i-check" type="checkbox" /></th>'+
				  		'<th>账号</th>'+
				  		'<th>姓名</th>'+
				  		'<th>申请时间</th>'+
				  		'<th>上传文件</th>'+
				  		'<th>操作</th>'+
				  	'</tr></thead><tbody>';
			for(var i=0;i<data.length;i++){
				html += '<tr>'+
							'<td><input did="'+data[i].id+'" class="i-check" type="checkbox" /></td>'+
					  		'<td>'+data[i].account+'</td>'+
					  		'<td>'+data[i].name+'</td>'+
					  		'<td>'+formatDateTime(data[i].indate,5)+'</td>'+
					  		'<td class="bankicon">'+
					  			'<span class="badge" style="cursor:pointer;" url="'+data[i].remark.substr(1)+'">查看</span>'+
					  		'</td><td>';
					  			if(data[i].admincheck=='1'){
						  			html += '<span class="badge badge-info">已审核</span>';
						  		}else{
						  			html += '<button did="'+data[i].id+'" class="btn green radius btn-sm sure">审核</button>';
						  		}
					  			html += '&nbsp;<button did="'+data[i].id+'" class="btn red radius btn-sm del">删除</button>'+
					  		'</td>'+
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
		$('.sure').bind('click',function(){
			var did = $(this).attr('did');
			layer.confirm('确认审核？',function(){
				ajaxReturn("sureCheckDeposits",{
					id:did
				},function(){
					layer.msg('系统处理中...',{time:500000000000});
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
		});

		$('.del').bind('click',function(){
			var did = $(this).attr('did');
			layer.confirm('确认删除？',function(){
				ajaxReturn("delDeposits",{
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