<?php

namespace Manage\Controller;

use Manage\Policies\Policies;
use Manage\Service\LogsService;
use Manage\Middleware\Auth;
use Think\Controller;

class LogsController extends Controller
{
    protected $logs;
    protected $policies;

    public function __construct()
    {
        parent::__construct();

        //实例化业务逻辑
        $this->logs = new LogsService();

        //实例化权限验证
        $this->policies = new Policies();
    }

    /**
     * 显示首页(查询页面)
     *
     * @return $this->display()
     */
    public function index()
    {
        $this->display();
    }

    /**
     * 异常添加页面
     *
     * @return $this->display()
     */
    public function create()
    {

        //登录中间件(未登录跳转到登录页面)
        Auth::check();

        //获取结果信息
        $this->assign('creat_report', session('creat_report') ? : null);

        //清空session
        session('creat_report', null);

        //返回视图
        $this->display();
    }

    /**
     * 处理异常添加的数据
     *
     * @return mixed
     */
    public function createPost()
    {

        //登录中间件(未登录跳转到登录页面)
        Auth::check();

        try{
            $this->logs->createPost(I('post.'));
        } catch (\Exception $e) {
            //记录结果到session中
            session('creat_report.error', $e->getMessage());

            //完成跳转
            return redirect('/manage/logs/create');
        }

        //记录结果到session中
        session('creat_report.success', '异常上报成功!');

        //完成跳转
        return redirect('/manage/logs/create');
    }

    /**
     * 处理查询
     * @return  $this->ajaxReturn
     */
    public function search()
    {
        //获取搜索用户类型
        $user_type = I('post.search_type') ? : null;

        //获取搜索条件
        if ($user_type == 'customer') {

            $type = I('post.customer_type');
            $value = I('post.customer_value');

        } else if ($user_type == 'employees') {

            $type = I('post.employees_type');
            $value = I('post.employees_value');

        }

        //验证数据完整性
        if (empty($user_type) || empty($type) || empty($value)) {
            $this->ajaxReturn(['error' => '请填写完整的搜索条件！']);
        }

        //返回给前台数据（json）
        $this->ajaxReturn(['success' => $this->logs->search($user_type, $type, $value)]);
    }

    /**
     * api页面视图
     */
    public function api()
    {

        //登录中间件(未登录跳转到登录页面)
        Auth::check();

        //传入参数
        $this->assign('token', $this->logs->token(session('user.id')));
        $this->assign('requency', $this->logs->requency(session('user.id')));

        //返回视图
        $this->display();
    }

    /**
     * 返回当前用户token
     */
    public function ajaxToken()
    {

        //登录中间件(未登录跳转到登录页面)
        Auth::check();

        $this->ajaxReturn($this->logs->generate(session('user.id')));
    }

}