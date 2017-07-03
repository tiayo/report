
function validateform2(form1,rules,messages,url,before,callback){
    var error1 = $('.alert-error', form1);
    var success1 = $('.alert-success', form1);

    form1.validate({
        errorElement: 'span',
        errorClass: 'help-inline',
        focusInvalid: false, 
        rules: rules,
        messages : messages,
        invalidHandler: function (event, validator) {      
            success1.hide();
            error1.show();
        },

        highlight: function (element) {
            $(element)
                .closest('.help-inline').removeClass('ok');
            $(element)
                .closest('.control-group').removeClass('success').addClass('error'); 
        },

        unhighlight: function (element) {
            $(element)
                .closest('.control-group').removeClass('error');
        },

        success: function (label) {
            label
                .addClass('valid').addClass('help-inline ok') 
            .closest('.control-group').removeClass('error').addClass('success'); 
        },

        submitHandler: function (form) {
            success1.show();
            error1.hide();
            $(form).ajaxSubmit({
            	url: url,                 //默认是form的action
                type: 'post',               //默认是form的method（get or post）
                dataType: "json",           //html(默认), xml, script, json...接受服务端返回的类型
                // clearForm: true,          //成功提交后，清除所有表单元素的值
                resetForm: true,          //成功提交后，重置所有表单元素的值
                beforeSubmit: function(arr,$form,options){
                    //formData: 数组对象，提交表单时，Form插件会以Ajax方式自动提交这些数据，格式如：[{name:user,value:val },{name:pwd,value:pwd}]
                    //jqForm:   jQuery对象，封装了表单的元素
                    //options:  options对象
                    //比如可以再表单提交前进行表单验证
                    if(typeof before === 'function'){
                        before(arr,$form,options);
                    }
                },
                //提交成功后的回调函数
                success: function(data,status,xhr,$form){
                    if(typeof callback === 'function'){
                        callback(data,status,xhr,$form);
                    }
                }
            });     
        }
    });
}

function highlight_subnav(url){

}
