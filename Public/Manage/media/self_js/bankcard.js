bankCard = {
	init:function(){
		this.changeBankCard();
		this.delBankCard();
		this.layerShowContent();
	},
	changeBankCard:function(){
		var self = this;
		$('.editCard,#add_new').click(function() {
			$this = $(this);
			var html = '<div class="form-horizontal">'+
							'<div class="row-fluid">'+
								'<div class="span12 ">'+
									'<div class="control-group">'+
										'<label class="control-label">币种</label>'+
										'<div class="controls">  '+                                              
											'<label class="radio">'+
												'<input type="radio" name="type" value="CNY"/>CNY'+
											'</label>'+
											'<label class="radio" id="type">'+
												'<input type="radio" name="type" value="USD"/>USD'+
											'</label>  '+	
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<div class="row-fluid">'+
								'<div class="span12 ">'+
									'<div class="control-group">'+
										'<label class="control-label">发卡银行</label>'+
										'<div class="controls">'+
											'<select class="m-wrap span3" name="bank_name">'+
												'<option value="">请选择银行</option>';
												$.each(bank,function(k, v) {
													html+='<option value='+k+'>'+v+'</option>';
												});
										html+='</select>'+
											'<input type="text" class="m-wrap span3" placeholder="区域/城市" name="bank_area" value="">'+
											'<input type="text" class="m-wrap span6" placeholder="支行名称" name="bank_branch" value="">'+
											'<span id="bank"></span>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<div class="row-fluid">'+
								'<div class="span12 ">'+
									'<div class="control-group">'+
										'<label class="control-label">账户</label>'+
										'<div class="controls">'+
											'<input type="text" class="m-wrap span3" placeholder="户名" name="bankaccount_name" value="">'+
											'<input type="text" class="m-wrap span9" placeholder="银行卡号" name="bankaccount_number" value="">'+
											'<span id="bankaccount"></span>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<div class="row-fluid">'+
								'<div class="span12 ">'+
									'<div class="control-group">'+
										'<label class="control-label">SWIFT识别码</label>'+
										'<div class="controls">'+
											'<input type="text" class="m-wrap span4" placeholder="SWIFT识别码" name="swift" value="">'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<div class="row-fluid">'+
								'<div class="span6 ">'+
									'<div class="control-group">'+
										'<input type="hidden" value="" name="cardpositiveurl">'+
										'<input type="hidden" value="" name="cardnegativeurl">'+
										'<label class="control-label">银行卡正面：</label>'+
										'<div class="controls">'+
											'<div id="idTopList" class="uploader-list">'+
												'<div class="file-item thumbnail"><img src=""></div>'+
											'</div>'+
											'<div id="idPickerTop">选择正面</div>'+
											'<span id="zheng"></span>'+
										'</div>'+
									'</div>'+
								'</div>'+
								'<div class="span6 ">'+
									'<div class="control-group">'+
										'<label class="control-label">银行卡反面：</label>'+
										'<div class="controls">'+
											'<div id="idBotList" class="uploader-list">'+
												'<div class="file-item thumbnail"><img src=""></div>'+
											'</div>'+
											'<div id="idPickerBot">选择反面</div>'+
											'<span id="fan"></span>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>';
			layer.open({
			    title: '修改银行卡信息',
			    closeBtn: 1,
			    area: '870px',
			    skin: 'layui-layer-demo', 
			    shadeClose: false,
			    content: html,
			    success:function(){
			    	// App.init(); 
			    	App.initUniform(); 
			    	cardUpload('#idPickerTop','#idTopList','cardpositiveurl');
					cardUpload('#idPickerBot','#idBotList','cardnegativeurl');
					var id = $this.parents('tr').data('id');
					if(id!==null){
						var type = $this.parents('tr').data('type');
						var bank = $this.parents('tr').data('bank');
						var bankaccount = $this.parents('tr').data('bankaccount');
						var code = $this.parents('tr').data('code');
						var zheng = $this.parents('tr').data('zheng');
						var fan = $this.parents('tr').data('fan');
						var swift = $this.parents('tr').data('swift');
						bank = bank.split('-');
						bankaccount = bankaccount.split('-');
						$('[name="bank_name"]').val(code);
						$('[name="type"][value="'+type+'"]').attr("checked",'checked');
						$('[name="bank_area"]').val(bank[1]);
						$('[name="bank_branch"]').val(bank[2]);
						$('[name="bankaccount_name"]').val(bankaccount[0]);
						$('[name="bankaccount_number"]').val(bankaccount[1]);
						$('[name="swift"]').val(swift);
						$('[name="cardpositiveurl"]').val(zheng);
						$('[name="cardnegativeurl"]').val(fan);
						$('#idTopList img').attr('src',rooturl+zheng);
						$('#idBotList img').attr('src',rooturl+fan);
						jQuery.uniform.update('input[type="radio"]');
					}
			    },
			    yes:function(){
			    	var params = {
			    		type:$('[name="type"]:checked').val(),
			    		swift:$('[name="swift"]').val(),
			    		cardpositiveurl:$('[name="cardpositiveurl"]').val(),
						cardnegativeurl:$('[name="cardnegativeurl"]').val(),
			    		bank:$('[name="bank_name"]').val()+'-'+$('[name="bank_area"]').val()+'-'+$('[name="bank_branch"]').val(),
			    		bankaccount:$('[name="bankaccount_name"]').val()+'-'+$('[name="bankaccount_number"]').val(),
			    		id:$this.parents('tr').data('id'),
			    		aid:self.GetQueryString("aid")
			    	};
			    	if(!params.type){
			    		layer.tips('请选择币种','#type');return;
			    	}
			    	if(!$('[name="bank_name"]').val()){
			    		layer.tips('请选择银行','#bank');return;
			    	}
			    	if(!$('[name="bank_area"]').val()){
			    		layer.tips('请填写区域','#bank');return;
			    	}
			    	if(!$('[name="bank_branch"]').val()){
			    		layer.tips('请填写支行','#bank');return;
			    	}
			    	if(!$('[name="bankaccount_name"]').val()){
			    		layer.tips('请填写户名','#bankaccount');return;
			    	}
			    	if(!$('[name="bankaccount_number"]').val()){
			    		layer.tips('请填写卡号','#bankaccount');return;
			    	}
			    	if(!params.cardpositiveurl){
			    		layer.tips('请上传银行卡正面','#zheng');return;
			    	}
			    	if(!params.cardnegativeurl){
			    		layer.tips('请上传银行卡反面','#fan');return;
			    	}
			    	ajaxReturn('editBank',params,function(){
			    		layer.msg('保存中...');
			    	},function(res){
			    		layer.closeAll();
			    		if(res.status){
			    			layer.alert(res.info,{icon:1});
			    			window.location.reload();
			    		}else{
			    			layer.alert(res.info,{icon:2});
			    		}
			    	});
			    }
			});
			
			
		})
	},
	delBankCard:function(){
		$('.delCard').click(function() {
			var id = $(this).data('id');
			layer.confirm('确定删除该银行卡？',function(){
				ajaxReturn('delCard',{id:id},null,function(res){
					if(res.status){
						layer.alert(res.info,{icon:1});
						window.location.reload();
					}else{
						layer.alert(res.info,{icon:2});
					}
				})
			})
			
		});
	},
	layerShowContent:function(){
		$(document).off('click','.showcard').on('click','.showcard',function(){
			var url = $(this).data('url').substr(1);
			layer.open({
			    type: 1,
			    title : false,
			    skin: 'layui-layer-demo', //样式类名
			    closeBtn: 0, //不显示关闭按钮
			    shift: 1,
			    area: ['auto','50%'],
			    shadeClose: true, //开启遮罩关闭
			    content: '<img style="width:600px;height:100%" src="/'+url+'">'
			});
		})
		
	},
	GetQueryString:function(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	    var r = window.location.search.substr(1).match(reg);
	    if(r!=null)return  unescape(r[2]); return null;
	}
}