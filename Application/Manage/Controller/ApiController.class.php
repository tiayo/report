<?php

namespace Manage\Controller;

use Manage\Service\ApiService;
use Manage\Service\LogsService;
use Think\Controller;

class ApiController extends Controller
{
    protected $api;
    protected $token;
    protected $logs;
    protected $user;

    public function __construct()
    {
        parent::__construct();

        $this->api = new ApiService();

        //获取token
        $this->verify();

        $this->logs = new LogsService();
    }

    /**
     * 验证token是否有效
     *
     * @return bool
     */
    public function verify()
    {
        //获取token
        $token = $this->api->bearerToken();

        //未获取到token
        if (!isset($token) || empty($token))
        {
            response('未获取到token!', 401);
        }

        //获取用户
        try {
            $this->user = $this->api->user($token);
        } catch (\Exception $e) {
            response($e->getMessage(), 403);
        }

        return true;
    }


    /**
     * 新增api
     */
    public function create()
    {
        //判断是否开放接口
        if (!C('API_CREATE')) {
            response('接口未开放，请联系管理员！');
        }

        //获取数据
        $post = I('post.');

        //执行业务逻辑
        try{
            $this->logs->createPost($post, $this->user);
        } catch (\Exception $e) {
            response($e->getMessage(), 403);
        }

        //返回结果与状态
        response('添加成功！');
    }

    /**
     * 查询api
     */
    public function search()
    {
        $post = I('post.');

        //验证数据完整性
        if (empty($post['search_type']) || empty($post['value'])) {
            response('请填写完整的搜索条件！', 403);
        }

        //返回结果与状态
        response($this->logs->search($post['user_type'], $post['search_type'], $post['value']));
    }


}