<?php

namespace Manage\Controller;

use Manage\Middleware\Guest;
use Manage\Service\LoginService;
use Think\Controller;

class LoginController extends Controller
{
    protected $login;

    public function __construct()
    {
        parent::__construct();

        //客人中间件(非客人跳转后台首页)
        Guest::check();

        //实例化业务逻辑类
        $this->login = new LoginService();
    }

    public function index()
    {
        //传入历史输入
        $this->assign('old_input', session('old_input') ? : null);

        //传入错误session
        $this->assign('login_error', session('login.error') ? : null);

        //删除session
        session('login.error', null);
        session('old_input', null);

        //视图显示
        $this->display();
    }

    public function login()
    {
        //获取所有前端数据
        $post = I('post.');

        try{
            $this->login->login($post);
        } catch (\Exception $e) {
            session('login.error', $e->getMessage());
            redirect('/manage/login');
        }
    }

    public function logout()
    {
        $user = session('user');


    }

}




