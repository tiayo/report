Setting = {
	allmt4group:{},
	init:function(){
		this.loadRulesList();
	},
	loadRulesList : function(url){
		if(typeof url == 'undefined'){
			var url = indexurl;
		}
		var params={};
		var self = this;
		ajaxReturn(url,{},function(){
			layer.msg('加载中...');
		},function(res){
			
			var html='<thead class="cf">'+
							'<tr>'+
								'<th>系统账户类型</th>'+
								'<th>可移动MT4组</th>'+
								'<th>注册默认MT4组</th>'+
								'<th>最低入金($)</th>'+
								'<th>最低出金($)</th>'+
								'<th>最高出金($)</th>'+
								'<th>限制注册MT4账号个数</th>'+
								'<th>MT4账号前缀</th>'+
								'<th>随机位数</th>'+
								'<th>杠杆</th>'+
								'<th>注册是否显示</th>'+
								'<th>编辑</th>'+
								'<th>删除</th>'+
							'</tr>'+
						'</thead>';
			layer.closeAll();
			if(res.status){
				params = res.info.list;
				self.allmt4group = res.info.allmt4group;
				var len = params.length;
				for (var i in params) {
					html+=	'<tr>'+
								'<td data-title="系统账户类型">'+params[i].title+'</td>'+
				              	'<td data-title="可移动MT4组">'+params[i].group+'</td>'+
				              	'<td data-title="注册默认MT4组">'+params[i].defaultgroup+'</td>'+
				              	'<td data-title="最低入金($)">'+params[i].lowest_in+'</td>'+
				              	'<td data-title="最低出金($)">'+params[i].lowest_out+'</td>'+
				              	'<td data-title="最高出金($)">'+params[i].highest_out+'</td>'+
				              	'<td data-title="限制注册MT4账号个数">'+params[i].limitmt4+'</td>'+
				              	'<td data-title="MT4账号前缀">'+params[i].account_pre+'</td>'+
				              	'<td data-title="随机位数">'+params[i].account_rand+'</td>'+
				              	'<td data-title="杠杆">'+params[i].leverage+'</td>'+
				              	'<td data-title="注册是否显示">'+(params[i].is_show=='0'?'否':'是')+'</td>'+
				              	'<td data-title="编辑"><a class="edit" data-id='+i+' href="javascript:;">编辑</a></td>'+
				              	'<td data-title="删除">';

				              		if(parseInt(parseInt(i)+1) == len){
				              			html += '<a class="del" data-id='+i+' href="javascript:;">删除</a>';
				              		}
				              	'</td>';
			              	'</tr>';
				}
			}
			$('#editTable1').empty().html(html);
			Setting.addNewTable(params);
			Setting.delTable();
			$('#page').html(res.info.page).find('li').unbind('click').bind('click',function(){
				var pageurl = $(this).attr('pageurl');
				Setting.loadRulesList(pageurl)
			})
		})
	},
	addNewTable:function(params){
		var self = this;
		$('#add_new,.edit').unbind('click').bind('click',function(event) {
			var $this = $(this);
			if(self.allmt4group){
				var index = $this.data('id');
				var html =	'<tr>'+
						'<td data-title="系统账户类型"><input type="text" class="m-wrap small"></td>'+
						'<td data-title="可移动MT4组"><select id="select1" name="select1" class="sel" multiple>';
          				for (var i = 0; i < self.allmt4group.length; i++) {
              				html+='<option value=\''+self.allmt4group[i]+'\'>'+self.allmt4group[i]+'</optioin>';
              			};
		              	html+='</select></td>'+
		              	'<td data-title="注册默认MT4组"><select class="m-wrap small">';
          				for (var i = 0; i < self.allmt4group.length; i++) {
              				html+='<option value=\''+self.allmt4group[i]+'\'>'+self.allmt4group[i]+'</optioin>';
              			};
		              	html+='</select></td>'+
		              	'<td data-title="最低入金($)"><input type="text" class="m-wrap small"></td>'+
		              	'<td data-title="最低出金($)"><input type="text" class="m-wrap small"></td>'+
		              	'<td data-title="最高出金($)"><input type="text" class="m-wrap small"></td>'+
		              	'<td data-title="限制注册MT4账号个数"><input type="text" class="m-wrap small"></td>'+
		              	'<td data-title="MT4账号前缀"><input readonly type="text" value="'+mt4_pre+'" class="m-wrap small"></td>'+
		              	'<td data-title="随机位数"><input type="text" class="m-wrap small"></td>'+
		              	'<td data-title="杠杆"><input type="text" class="m-wrap small"></td>'+
		              	'<td data-title="注册是否显示"><select class="m-wrap small"><option value="1">是</option><option value="0">否</option></select></td>'+
		              	'<td data-title="编辑"><a class="save" href="javascript:;">保存</a></td>'+
		              	'<td data-title="取消"><a class="cancel" href="javascript:;">取消</a></td>'+
	              	'</tr>';
	              	if($this.hasClass('edit')){
	              		var newhtml='<thead class="cf">'+
										'<tr>'+
											'<th>系统账户类型</th>'+
											'<th>可移动MT4组</th>'+
											'<th>注册默认MT4组</th>'+
											'<th>最低入金($)</th>'+
											'<th>最低出金($)</th>'+
											'<th>最高出金($)</th>'+
											'<th>限制注册MT4账号个数</th>'+
											'<th>MT4账号前缀</th>'+
											'<th>随机位数</th>'+
											'<th>杠杆</th>'+
											'<th>注册是否显示</th>'+
											'<th>编辑</th>'+
											'<th>删除</th>'+
										'</tr>'+
									'</thead>';
	              		for (var i in params) {
	              			if(i==index){
	              				newhtml	+=html;
	              			}else{
	              				newhtml	+=	'<tr>'+
												'<td data-title="系统账户类型">'+params[i].title+'</td>'+
								              	'<td data-title="可移动MT4组">'+params[i].group+'</td>'+
												'<td data-title="注册默认MT4组">'+params[i].defaultgroup+'</td>'+
								              	'<td data-title="最低入金($)">'+params[i].lowest_in+'</td>'+
								              	'<td data-title="最低出金($)">'+params[i].lowest_out+'</td>'+
								              	'<td data-title="最高出金($)">'+params[i].highest_out+'</td>'+
								              	'<td data-title="限制注册MT4账号个数">'+params[i].limitmt4+'</td>'+
								              	'<td data-title="MT4账号前缀">'+params[i].account_pre+'</td>'+
								              	'<td data-title="随机位数">'+params[i].account_rand+'</td>'+
								              	'<td data-title="杠杆">'+params[i].leverage+'</td>'+
								              	'<td data-title="注册是否显示">'+(params[i].is_show=='0'?'否':'是')+'</td>'+
								              	'<td data-title="编辑"><a class="edit" data-id='+i+' href="javascript:;">编辑</a></td>'+
								              	'<td data-title="删除"><a class="del" data-id='+i+' href="javascript:;">删除</a></td>';
							              	'</tr>';
	              			}
							
						}
						var temp = new Array();
						$('#editTable1').empty().html(newhtml);
						var $parents_input = $('.save').parents('tr').find('input');
						var $parents_select = $('.save').parents('tr').find('select');
	              		// $(self).parents('tr').after(html);
	              		$parents_input.eq(0).val(params[index].title);
	              		$parents_select.eq(2).find("option").each(function (){
						    if($(this).val()==params[index].is_show){
						        $(this).attr('selected',true);
						    }
						});
						$parents_select.eq(1).find("option").each(function (){
						    if($(this).val()==params[index].defaultgroup){
						        $(this).attr('selected',true);
						    }
						});
						$parents_input.eq(1).val(params[index].lowest_in);
						$parents_input.eq(2).val(params[index].lowest_out);
						$parents_input.eq(3).val(params[index].highest_out);
						$parents_input.eq(4).val(params[index].limitmt4);
						$parents_input.eq(5).val(params[index].account_pre);
						$parents_input.eq(6).val(params[index].account_rand);
						$parents_input.eq(7).val(params[index].leverage);
	              		temp = params[index].group!==null?params[index].group.split(','):'';
	          			for (var i = 0; i < temp.length; i++) {
	      					$parents_select.eq(0).find("option").each(function (){
							    if($(this).text()==temp[i]){
							        $(this).attr('selected',true);
							    }
							});
	          			};
	          			
	              		// $('.save').parents('tr').remove();
						self.saveTable(index);
						self.addNewTable(params);
						self.delTable();
					}else{
						$('#editTable1 > thead > tr').eq(0).after(html);
						self.saveTable();

					}
					$('.sel').each(function() {
						$(this).selectator({
							showAllOptionsOnFocus: true,
						})
					});
	              	self.cancelTable();
			}
			
		});
	},
	cancelTable:function(){
		var self = this;
		$('.cancel').click(function(event) {
			self.loadRulesList();
		});
	},
	multiValue : function(dom){
		var value = '';
		dom.each(function(index) {
			if(index == 0){
				value = $(this).val();
			}else{
				value += ','+$(this).val();
			}	
		});
		return value;
	},
	saveTable:function(index,pid){
		var self = this;
		$('.save').click(function(event) {
			var $parents_input = $(this).parents('tr').find('input');
			var $parents_select = $(this).parents('tr').find('select');
			var params = {
				title : $parents_input.eq(0).val(),
				lowest_in : $parents_input.eq(2).val(),
				lowest_out : $parents_input.eq(3).val(),
				highest_out : $parents_input.eq(4).val(),
				limitmt4 : $parents_input.eq(5).val(),
				account_pre : $parents_input.eq(6).val(),
				account_rand : $parents_input.eq(7).val(),
				leverage : $parents_input.eq(8).val(),
				defaultgroup : $parents_select.eq(1).val(),
				is_show : $parents_select.eq(2).val(),
				group : $parents_select.eq(0).val()
				// group : self.multiValue($('#select1 option:selected'))	
			};
			if(index!==undefined){
				params.key = index;
			}
			if(params.title==''){
				layer.alert('请输入系统账户名称！',{icon:2});
				return;
			}
			if(params.lowest_in=='' || isNaN(params.lowest_in)){
				layer.alert('请输入正确最低入金！',{icon:2});
				return;
			}
			if(params.lowest_out=='' || isNaN(params.lowest_out)){
				layer.alert('请输入正确最低出金！',{icon:2});
				return;
			}
			if(params.highest_out=='' || isNaN(params.highest_out)){
				layer.alert('请输入正确最高出金！',{icon:2});
				return;
			}
			if(params.limitmt4=='' || isNaN(params.limitmt4)){
				layer.alert('请输入正确限制mt4账号个数！',{icon:2});
				return;
			}
			if(params.account_pre=='' || isNaN(params.account_pre)){
				layer.alert('请输入正确MT4账号前缀！',{icon:2});
				return;
			}
			if(params.account_rand=='' || isNaN(params.account_rand)){
				layer.alert('请输入正确随机位数！',{icon:2});
				return;
			}
			if(params.leverage==''){
				layer.alert('请输入杠杆！',{icon:2});
				return;
			}
			ajaxReturn(createurl,params,null,function(res){
				if(res.status){
					self.loadRulesList();
				}else{
					layer.alert(res.info,{icon:2});
				}	
			})
		});
	},
	delTable:function(){
		var self = this;
		$('.del').click(function(event) {
			var id = $(this).data('id');
			layer.confirm('确定删除？',function(){
				ajaxReturn(delurl,{id:id},null,function (res) {
					if(res.status){
						self.loadRulesList();
					}else{
						layer.alert(res.info,{icon:2})
					}
					
				})
			})	
		});
	}

}