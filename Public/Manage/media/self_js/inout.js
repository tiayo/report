InOut = {
	pageParams : {},
	$target : null,

	init : function(){
		this.$target = $('#tbody');
		this.layerDate();
		this.loadList();
		this.searchEvent();	
	},

	report : function(){
		this.buildQueryParams();
		var params="type="+this.pageParams.type+"&start_time="+this.pageParams.start_time+"&end_time="+
		this.pageParams.end_time+"&account="+this.pageParams.account;
		window.location.href = reportUrl+"?"+params;
	},

	searchEvent : function(){
		var self = this;
		$('#searBtn').unbind('click').bind('click',function(){
			self.searchEvent();
			self.loadList();
		})
	},

	layerDate : function(){
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

	buildQueryParams : function(){
		this.pageParams.type = $('[name=type]').val();
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
			self.$target.html('<tr align="center"><td colspan="7">努力加载中...</td></tr>');$('#page').empty();
		},function(res){
			if(res.status){
				var result = self.buildHtml(res.info.list);
				self.$target.html(result[0]);
				$('#page').empty().html(res.info.page);
				var total = Number(result[1]).toFixed(2);
				$('#total').text(Number(res.info.totalprofit).toFixed(2));
				$('.pagination li').bind('click',function(){
					var url = $(this).attr('pageurl');
					if(url !=''){
						self.loadList(url);
					}
				})
			}else{
				layer.alert(res.info,{icon:2});
				return;
			}
		})
	},

	buildHtml : function(data){
		var html = '';
		var total=0;
		for(var i=0;i<data.length;i++){
			html += '<tr><td>'+data[i].login+'</td><td>'+data[i].name+'</td><td>';
				if(data[i].profit<0){
					html += '<span class="badge badge-important">出金</span>';
				}else{
					html += '<span class="badge badge-success">入金</span>';
				}
			html += '</td>'+
			  		'<td>$'+data[i].profit+'</td>'+
			  		'<td>'+data[i].comment+'</td>'+
			  		'<td>'+data[i].close_time+'</td>'+
			  		'</tr>';
			total += Number(data[i].profit);
		}
		return [html,total];
	}
}