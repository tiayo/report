<?php
	
	require("easypay-api-sdk-php.php");

	$parameters = array(
			"merchantNo" => "88888888", 
			"outTradeNo" => uniqid(), 
			"currency" => "CNY",
			"amount" => 100,
			"payType" => "ALIPAY_QRCODE_PAY",
			"content" => "PHP SDK",
			"callbackURL" => "http://php.uqiantu.net/callback.do"
			);

	$response = request("com.opentech.cloud.easypay.trade.create", "0.0.1", $parameters);

	//print_r($response);
	printf("===================================================================\n");
	printf("errorCode: %s\n", $response["errorCode"]);
	printf("msg: %s\n", $response["msg"]);
	printf("data: %s\n", $response["data"]);
?>
