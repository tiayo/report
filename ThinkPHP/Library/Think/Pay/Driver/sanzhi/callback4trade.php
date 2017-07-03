<?php
	require("./easypay-api-sdk-php.php");

	/**
	 *
	 *
	 */
	function callback4trade($data) {

		// demo 您的处理逻辑
		print_r($data);
	}

	//
	process_callback4trade("callback4trade");
?>
