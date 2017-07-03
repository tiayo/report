Manage = {

	pageParams : {},

	init : function(){
		this.initSearchEvent();
		this.searchToday();
		this.loadList();
		this.pageEvent();
		this.selectGroup();
	},

	selectGroup : function(){
		$('select[name=group]').bind('change',function(){
			var group = $(this).find('option:selected').val();
			Manage.pageParams.group = group;
			Manage.loadList();
		})
	},


	pageEvent : function(){
		$(document).on('click','#page ul li',function(){
			var url = $(this).attr('pageurl');
			Manage.loadList(url);
		})
	},

	searchToday : function(){
		var self = this;
		$('#range1').mouseover(function(){
			layer.tips('出场时间为昨日','#range1', {
			    tips: [1, '#0FA6D8'] //还可配置颜色
			});
		});
		$('#range2').mouseover(function(){
			layer.tips('出场时间为今日','#range2', {
			    tips: [1, '#0FA6D8'] //还可配置颜色
			});
		})
		$('#range3').mouseover(function(){
			layer.tips('出场时间为本周','#range3', {
			    tips: [1, '#0FA6D8'] //还可配置颜色
			});
		})
		$('#range4').mouseover(function(){
			layer.tips('出场时间为上周','#range4', {
			    tips: [1, '#0FA6D8'] //还可配置颜色
			});
		})
		$('#range6').mouseover(function(){
			layer.tips('出场时间为上月','#range6', {
			    tips: [1, '#0FA6D8'] //还可配置颜色
			});
		})
		$('#range5').mouseover(function(){
			layer.tips('出场时间为本月','#range5', {
			    tips: [1, '#0FA6D8'] //还可配置颜色
			});
		})
		$('#range7').mouseover(function(){
			layer.tips('出场时间为本季度','#range7', {
			    tips: [1, '#0FA6D8'] //还可配置颜色
			});
		})
		
		$('.timerange').bind('click',function(){
			var $o = $(this);
			if($o.hasClass('red')){
				$o.removeClass('red');
				self.pageParams.daterange = '';
				$o.siblings().removeClass('red');
			}else{
				self.pageParams.daterange = $o.attr('daterange');
				$o.siblings().removeClass('red');			
				$(this).addClass('red');
			}
			self.buildQueryParams();
			self.loadList();
		})
	},


	buildQueryParams : function(){
		var q = $.trim($('#searchVal').val());
		this.pageParams.account = q;
		this.pageParams.openstartTime = $.trim($('#openbegin').val());
		this.pageParams.openendTime =$.trim($('#openend').val());
		this.pageParams.closestartTime = $.trim($('#closebegin').val());
		this.pageParams.closeendTime =$.trim($('#closeend').val());
		// this.pageParams.daterange = $('#daterange').find('.red').attr('daterange');
	},
	report : function(){
		this.buildQueryParams();
		// console.log(this.pageParams);return
		if(this.pageParams.daterange==='undefined'){
			this.pageParams.daterange='';
		}
		var params="daterange="+this.pageParams.daterange+"&account="+this.pageParams.account+"&openstartTime="+this.pageParams.openstartTime+"&openendTime="+
		this.pageParams.openendTime+"&closestartTime="+this.pageParams.closestartTime+"&closeendTime="+this.pageParams.closeendTime;
		window.location.href = reportUrl+"?"+params;
	},
	initSearchEvent : function(){
		var self = this;
		$('#searchBtn').bind('click',function(){
			self.buildQueryParams();
			self.loadList();
		});
	},

	buildUrl : function(){
		if(url.indexOf('groups')>-1){
			return 'groups';
		}else if(url.indexOf('lists')>-1){
			return 'lists';
		}else if(url.indexOf('option')>-1){
			return 'option';
		}else if(url.indexOf('inouts')>-1){
			return 'inouts';
		}
		return 'lists';
	},

	loadList : function(url){
		var self = this;
		if(!url){
			var url = Manage.buildUrl();
		}
		ajaxReturn(url,self.pageParams, function(){
			layer.msg('努力加载中...');
		},function(res){
	       	layer.closeAll();
	       	if(res.info.list.length>0){
	       		var u = Manage.buildUrl();
	       		if(u=='groups'){
	       			self.buildGroupHtml(res.info.list);
	       		}else if(u =='inouts'){
	       			self.buildInoutsHtml(res.info.list);
	       		}else if(u =='lists'){
	       			self.buildListsHtml(res.info.list);
	       			
	       			$('#totalMoney').html('$'+Number(res.info.totalmyprofit).toFixed(2));
		        	$('#totalVolume').html(Number(res.info.totalvolume).toFixed(2)+'手');
	       		}else{
	       			self.buildHtml(res.info.list);
	       			$('#totalMoney').html('$'+Number(res.info.totalmyprofit).toFixed(2));
		        	$('#totalVolume').html('$'+Number(res.info.totalvolume)/100);
	       		}
		        
		        $('#page').html(res.info.page);
		    }else{
		    	$('#totalMoney').html('$0.00');
		        $('#totalVolume').html('0.00手');
		    	$('#page').empty();
		    	$('#tbody2').empty().html('<tr><td colspan="12">暂无记录...</td></tr>');
		    }
	    });
	},

	buildInoutsHtml : function(data){
		var html = '';
		$.each(data,function(k,v){
			html += '<tr>'+
					'<td>'+v.LOGIN+'</td>';
					if(Number(v.PROFIT)>0){
						html += '<td style="color:red">入金</td>';
					}else{
						html += '<td style="color:green">出金</td>';
					}	
					
			html += '<td>'+v.OPEN_TIME+'</td><td>$'+v.PROFIT+'</td></tr>';
		});
		$('#tbody2').empty().html(html);
	},

	buildGroupHtml : function(data){
		var html = '';
		$.each(data,function(k,v){
			html += '<tr><td>'+v.login+'</td>'+
					'<td>$'+Number(v.totalmoney).toFixed(2)+'</td>'+
					'<td>$'+v.totalvolume/100+'</td></tr>';
		});
		$('#tbody2').empty().html(html);
	},

	buildHtml : function(data){
		var html = '';
		$.each(data,function(k,v){
			html += '<tr>'+
					'<td>'+v.login+'</td>'+
					'<td>'+v.name+'</td>'+
					'<td>'+v.ticket+'</td>'+
					'<td>'+v.open_time+'</td>'+
					'<td>'+v.close_time+'</td>'+
					'<td>'+v.symbol+'</td>'+
					'<td>'+Number(v.open_price).toFixed(v.digits)+'</td>'+
					'<td>'+Number(v.close_price).toFixed(v.digits)+'</td>';
					if(v.cmd=='0'){
						html += '<td style="color:red">看涨</td>';
					}else if(v.cmd=='1'){
						html += '<td style="color:green">看跌</td>';
					}	
					
			html += '<td>$'+Number(v.profit).toFixed(2)+'</td>'+
					'<td>$'+v.volume/100+'</td></tr>';
		});
		$('#tbody2').empty().html(html);
	},

	buildListsHtml : function(data){
		var html = '';
		$.each(data,function(k,v){
			html += '<tr>'+
					'<td>'+v.login+'</td>'+
					'<td>'+v.name+'</td>'+
					'<td>'+v.ticket+'</td>'+
					'<td>'+v.symbol+'</td><td>';
					switch (v.cmd) {
						case '0':
							html += 'buy';
							break;
						case '1':
							html += 'sell';
							break;
						case '2':
							html += 'buy limit';
							break;
						case '3':
							html += 'sell limit';
							break;
						case '4':
							html += 'buy stop';
							break;
						case '5':
							html += 'sell stop';
							break;
					}
					html += '</td><td>'+Number(v.volume/100).toFixed(2)+'手</td>'+
					'<td>'+v.open_time+'</td>'+
					'<td>'+v.close_time+'</td>'+
					'<td>'+Number(v.open_price).toFixed(v.digits)+'</td>'+
					'<td>'+Number(v.close_price).toFixed(v.digits)+'</td>'+
					'<td>'+v.tp+'/'+v.sl+'</td>';
					if(Number(v.profit)>0){
						html += '<td><span class="badge badge-success">$'+v.profit+'</span></td></tr>';
					}else{
						html += '<td><span class="badge badge-important">$'+v.profit+'</span></td></tr>';
					}
					
		});
		$('#tbody2').empty().html(html);
	}

}