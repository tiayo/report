<?php
    if(C('LAYOUT_ON')) {
        echo '{__NOLAYOUT__}';
    }
?>
<!DOCTYPE html>

<!--[if IE 8]> <html lang="en" class="ie8"> <![endif]-->

<!--[if IE 9]> <html lang="en" class="ie9"> <![endif]-->

<!--[if !IE]><!--> <html lang="en"> <!--<![endif]-->
<head>

	<meta charset="utf-8" />
	<title>系统发生错误</title>
	<meta content="width=device-width, initial-scale=1.0" name="viewport" />
	<link href="/Public/Manage/media/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
	<link href="/Public/Manage/media/css/error.css" rel="stylesheet" type="text/css"/>
</head>
<body class="page-500-full-page">

	<div class="row-fluid">

		<div class="span12 page-500">
			<div class=" number"><?php echo strip_tags($e['message']);?></div>
			<div class=" details">
				<h3>错误位置：FILE: <?php echo $e['file'] ;?> &#12288;LINE: <?php echo $e['line'];?></h3>
				<?php if(isset($e['trace'])) {?>
					<div class="info">
						<div class="title">
							<h3>TRACE</h3>
						</div>
						<div class="text">
							<p><?php echo nl2br($e['trace']);?></p>
						</div>
					</div>
				<?php }?>
			</div>
		</div>

	</div>


</html>