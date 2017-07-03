$(document).ready(function () {
    $('#employees_submit').click(function () {

        //搜索中弹框
        $('.float').removeClass('hidden');


        //获取用户输入数据
        var employees_type = $('#employees_type').val();
        var employees_value = $('#employees_value').val();

        //获取ajax数据
        $.ajax({
            type: "post",
            data:{search_type:'employees',employees_type:employees_type, employees_value:employees_value},
            url: "/manage/logs/search/",
            dataType: "json",
            success: function (data) {

                //初始化
                var html = '';
                $('.float').addClass('hidden');
                $('#alert_error').addClass('hidden');

                //是否返回报错信息
                if (data.error != undefined) {
                    //滚动到顶部
                    $('html, body').animate({
                        scrollTop: $("body").offset().top
                    }, 1000);

                    //输出错误提示框
                    $('#alert_error').removeClass('hidden');

                    //向提示框写入错误数据
                    $('#alert_error span').html(data.error);

                    //阻止继续执行
                    return false;
                }

                //遍历生成html
                $.each(data.success, function(name,value) {
                    html += '<tr>'+
                        '<th>'+value.id+'</th>'+
                        '<th>'+value.name+'</th>'+
                        '<th>'+value.phone+'</th>'+
                        '<th>'+value.email+'</th>'+
                        '<th>异常从业人员</th>'+
                        '<th>'+value.ip_address+'</th>'+
                        '<th>'+value.idcardnumber+'</th>'+
                        '<th>'+value.user_address+'</th>'+
                        '<th>'+value.remark+'</th>'+
                        '</tr>';
                });

                //插入html
                $('#target').html(html);

                //滚动到结果位置
                $('html, body').animate({
                    scrollTop: $("#target").offset().top
                }, 2000);
            }
        });
    })
})