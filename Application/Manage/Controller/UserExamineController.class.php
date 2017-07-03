<?php

namespace Manage\Controller;

use Manage\Service\UserExamineService;
use Think\Controller;

class UserExamineController extends Controller
{
    protected $examine;
    protected $num;

    public function __construct()
    {
        parent::__construct();

        //权限验证
        $this->examine = new UserExamineService();

        //页面显示条数
        $this->num = C('PAGE_NUM');
    }

    /**
     * 视图页面
     *
     * @return $this->display()
     */
    public function index()
    {
        //获取页数
        $page = I('get.page') ? : 1;

        //获取会员列表
        $users = $this->examine->users($page, $this->num);

        //传入参数
        $this->assign('users', $users);
        $this->assign('page', $page == 1 ? 2 : $page);
        $this->assign('current', $page);
        $this->assign('count', ceil($this->examine->countUsers() / $this->num));

        //返回视图
        $this->display();
    }

    /**
     * 激活用户
     *
     * @return mixed
     */
    public function examine()
    {
        $this->examine->unified('examine');
    }

    /**
     * 拉黑用户
     *
     * @return mixed
     */
    public function close()
    {
        $this->examine->unified('close');
    }

    /**
     * 升级权限
     *
     * @return mixed
     */
    public function up()
    {
        $this->examine->unified('up');
    }

    /**
     * 降低权限
     *
     * @return mixed
     */
    public function down()
    {
        $this->examine->unified('down');
    }

    /**
     * 搜索用户
     */
    public function search()
    {
        //获取值
        $type = I('get.search_type');
        $value = I('get.search_value');

        //获取页数
        $page = I('get.page') ? : 1;

        //验证数据完整性
        if (!isset($type) || !isset($value)) {
            $this->ajaxReturn(['error' => '请填写完整的搜索条件！']);
        }

        //获取用户列表
        $users = $this->examine->search($type, $value, $page, $this->num);

        //传值
        $this->assign('users', $users['data']);
        $this->assign('page', $page == 1 ? 2 : $page);
        $this->assign('count', ceil($users['count'] / $this->num));

        //返回视图
        $this->display('index');
    }

}