// var upload;
Thumbnail={
	init: function(){
		this.idCardTop();
		this.bannerUpload();
	},
	idCardTop: function(){
			
		    var $list = $('#fileList'),
		        // 优化retina, 在retina下这个值是2
		        ratio = window.devicePixelRatio || 1,

		        // 缩略图大小
		        thumbnailWidth = 300 * ratio,
		        thumbnailHeight = 192 * ratio,

		        // Web Uploader实例
		        uploader;

		    // 初始化Web Uploader
		    uploader = WebUploader.create({

		        // 自动上传。
		        auto: true,

		        fileNumLimit: 1, 

		        fileSingleSizeLimit : 3*1024*1024,

		        // swf文件路径
		        swf: "__STATIC__/webuploader/Uploader.swf",

		        // 文件接收服务端。
		        server: imgUrl,

		        // 选择文件的按钮。可选。
		        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
		        pick: '#filePicker',

		        // 只允许选择文件，可选。
		        accept: {
		            title: 'Images',
		            extensions: 'gif,jpg,jpeg,bmp,png',
		            mimeTypes: 'image/*'
		        }
		    });

		    uploader.on( 'error', function( type ) {
		        if (type=="Q_TYPE_DENIED"){
		            layer.alert("请上传gif,jpg,jpeg,bmp,png格式文件",{icon:2});
		        }else if(type=="F_EXCEED_SIZE"){
		            layer.alert("文件大小不能超过3M",{icon:2});
		        }else if(type == 'Q_EXCEED_NUM_LIMIT'){
		        	layer.alert("只能上传一张图片",{icon:2});
		        }
		    });

		    // 当有文件添加进来的时候
		    uploader.on( 'fileQueued', function( file ) {
		    	$("#fileList").empty();
		        var $li = $(
		                '<div id="' + file.id + '" style="position:relative" class="file-item thumbnail">' +
		                    '<img>' +
		                    // '<div class="info">' + file.name + '</div>' +
		                '</div>'
		                ),
		            $img = $li.find('img');
		        	$list.append( $li );
		        	$btns = $('<h3><span class="icon-remove" style="color:red;cursor:pointer;position:absolute;right:0;top:0;"></span></h3>').appendTo( $li );
		        	$btns.bind('click',function(){
		        		uploader.removeFile(file,true);
						$("#fileList").empty();
						$('[name="thumbnail"]').val('');
		        		// $('#filePicker').next().remove();
		        	})

		        $list.append( $li );

		        // 创建缩略图
		        uploader.makeThumb( file, function( error, src ) {
		            if ( error ) {
		                $img.replaceWith('<span>不能预览</span>');
		                return;
		            }

		            $img.attr( 'src', src );
		        }, thumbnailWidth, thumbnailHeight );
		    });

		    // 文件上传过程中创建进度条实时显示。
		    uploader.on( 'uploadProgress', function( file, percentage ) {
		        var $li = $( '#'+file.id ),
		            $percent = $li.find('.progress span');

		        // 避免重复创建
		        if ( !$percent.length ) {
		            $percent = $('<p class="progress"><span></span></p>')
		                    .appendTo( $li )
		                    .find('span');
		        }

		        $percent.css( 'width', percentage * 100 + '%' );
		    });

		    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
		    uploader.on( 'uploadSuccess', function( file,res ) {
		        $( '#'+file.id ).addClass('upload-state-done');
			    var res = eval('('+res._raw+')');
			    if(res.status){
	            	$('#filePicker').attr('file',res.file);
	            	$('#'+file.id).attr('file',res.file);
	            	$('[name=thumbnail]').val(res.file);
			    }else{
			    	layer.alert(res.message,{icon:2})
			    }
		    });

		    // 文件上传失败，现实上传出错。
		    uploader.on( 'uploadError', function( file ) {
		        var $li = $( '#'+file.id ),
		            $error = $li.find('div.error');

		        // 避免重复创建
		        if ( !$error.length ) {
		            $error = $('<div class="error"></div>').appendTo( $li );
		        }

		        $error.text('上传失败');
		    });

		    // 完成上传完了，成功或者失败，先删除进度条。
		    uploader.on( 'uploadComplete', function( file ) {
		        $( '#'+file.id ).find('.progress').remove();
		    });
	},
	bannerUpload:function(){
		var $list = $('#banfileList'),
		        // 优化retina, 在retina下这个值是2
		        ratio = window.devicePixelRatio || 1,

		        // 缩略图大小
		        thumbnailWidth = 300 * ratio,
		        thumbnailHeight = 192 * ratio,

		        // Web Uploader实例
		        uploader;

		    // 初始化Web Uploader
		    uploader = WebUploader.create({

		        // 自动上传。
		        auto: true,

		        fileNumLimit: 1, 

		        fileSingleSizeLimit : 3*1024*1024,

		        // swf文件路径
		        swf: "__STATIC__/webuploader/Uploader.swf",

		        // 文件接收服务端。
		        server: imgUrl,

		        // 选择文件的按钮。可选。
		        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
		        pick: '#banPicker',

		        // 只允许选择文件，可选。
		        accept: {
		            title: 'Images',
		            extensions: 'gif,jpg,jpeg,bmp,png',
		            mimeTypes: 'image/*'
		        }
		    });

		    uploader.on( 'error', function( type ) {
		        if (type=="Q_TYPE_DENIED"){
		            layer.alert("请上传gif,jpg,jpeg,bmp,png格式文件",{icon:2});
		        }else if(type=="F_EXCEED_SIZE"){
		            layer.alert("文件大小不能超过3M",{icon:2});
		        }else if(type == 'Q_EXCEED_NUM_LIMIT'){
		        	layer.alert("只能上传一张图片",{icon:2});
		        }
		    });

		    // 当有文件添加进来的时候
		    uploader.on( 'fileQueued', function( file ) {
		    	$("#banfileListt").empty();
		        var $li = $(
		                '<div id="' + file.id + '" style="position:relative" class="file-item thumbnail">' +
		                    '<img>' +
		                    // '<div class="info">' + file.name + '</div>' +
		                '</div>'
		                ),
		            $img = $li.find('img');
		        	$list.append( $li );
		        	$btns = $('<h3><span class="icon-remove" style="color:red;cursor:pointer;position:absolute;right:0;top:0;"></span></h3>').appendTo( $li );
		        	$btns.bind('click',function(){
		        		uploader.removeFile(file,true);
						$("#banfileListt").empty();
						$('[name="banner"]').val('');
		        	})

		        $list.append( $li );

		        // 创建缩略图
		        uploader.makeThumb( file, function( error, src ) {
		            if ( error ) {
		                $img.replaceWith('<span>不能预览</span>');
		                return;
		            }

		            $img.attr( 'src', src );
		        }, thumbnailWidth, thumbnailHeight );
		    });

		    // 文件上传过程中创建进度条实时显示。
		    uploader.on( 'uploadProgress', function( file, percentage ) {
		        var $li = $( '#'+file.id ),
		            $percent = $li.find('.progress span');

		        // 避免重复创建
		        if ( !$percent.length ) {
		            $percent = $('<p class="progress"><span></span></p>')
		                    .appendTo( $li )
		                    .find('span');
		        }

		        $percent.css( 'width', percentage * 100 + '%' );
		    });

		    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
		    uploader.on( 'uploadSuccess', function( file,res ) {
		        $( '#'+file.id ).addClass('upload-state-done');
			    var res = eval('('+res._raw+')');
			    if(res.status){
	            	$('#banPicker').attr('file',res.file);
	            	$('#'+file.id).attr('file',res.file);
	            	$('[name=banner]').val(res.file);
			    }else{
			    	layer.alert(res.message,{icon:2})
			    }
		    });

		    // 文件上传失败，现实上传出错。
		    uploader.on( 'uploadError', function( file ) {
		        var $li = $( '#'+file.id ),
		            $error = $li.find('div.error');

		        // 避免重复创建
		        if ( !$error.length ) {
		            $error = $('<div class="error"></div>').appendTo( $li );
		        }

		        $error.text('上传失败');
		    });

		    // 完成上传完了，成功或者失败，先删除进度条。
		    uploader.on( 'uploadComplete', function( file ) {
		        $( '#'+file.id ).find('.progress').remove();
		    });
	}
}