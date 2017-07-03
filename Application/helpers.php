<?php

if (! function_exists('response')) {
    /**
     * 处理返回json结果和返回状态码
     *
     * @param $value
     * @param int $code
     */
    function response($value, $code = 200)
    {
        echo json_encode($value, JSON_UNESCAPED_UNICODE);
        http_response_code($code);
        exit();
    }
}


if (! function_exists('can')) {
    /**
     * 全局使用独立权限控制
     *
     * @param $function
     * @param $array
     * @return bool
     */
    function can($function, $array)
    {
        $policise = new \Manage\Policies\Policies();

        return $policise->$function(...$array);
    }
}

if (! function_exists('dd')) {
    /**
     * 断点调试
     *
     * @param $data
     */
    function dd($data)
    {
        var_dump($data);
        exit();
    }
}