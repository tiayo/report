<?php

return array(

    //超级管理员ID设置
    'SUPER_ADMIN_ID' => [13],

    //权限表(key值越大权限越大,超级管理员只能比下一级管理员多1)
    'LIST' => [

        '1' => 'SIMPLE_USER',//普通用户

        '2' => 'SIMPLE_ADMIN',//普通管理员

        '3' => 'HIGHT_ADMIN',//高级管理员

        '4' => 'SUPER_ADMIN',//超级管理员
    ],





);