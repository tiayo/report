<?php

namespace Manage\Controller;

use Manage\Service\LogsExamineService;
use Think\Controller;

class LogsExamineController extends Controller
{
    protected $examine;
    protected $num;

    public function __construct()
    {
        parent::__construct();

        //权限验证
        $this->examine = new LogsExamineService();

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

        //获取异常列表
        $logs = $this->examine->logs($page, $this->num);

        //传入参数
        $this->assign('logs', $logs);
        $this->assign('page', $page == 1 ? 2 : $page);
        $this->assign('current', $page);
        $this->assign('count', ceil($this->examine->countLogs() / $this->num));
        $this->assign('num', $this->num);

        //返回视图
        $this->display();
    }

    /**
     * 审核记录
     *
     * @return mixed
     */
    public function examine()
    {
        $this->examine->unified('examine');
    }

    /**
     * 搜索用户
     */
    public function search()
    {
        //获取值
        $type = I('get.search_type');
        $value = I('get.search_value');
        $column = I('get.search_column');

        //获取页数
        $page = I('get.page') ? : 1;

        //验证数据完整性
        if (!isset($type) || !isset($value) || !isset($column)) {
            $this->ajaxReturn(['error' => '请填写完整的搜索条件！']);
        }

        //获取列表
        $logs = $this->examine->search($type, $value, $column, $page, $this->num);

        //传值
        $this->assign('logs', $logs['data']);
        $this->assign('page', $page == 1 ? 2 : $page);
        $this->assign('current', $page);
        $this->assign('count', ceil($logs['count'] / $this->num));
        $this->assign('num', $this->num);

        //返回视图
        $this->display('index');
    }

    /**
     * 删除异常记录
     */
    public function delete()
    {
        //获取id
        $log_id = I('get.id');

        //执行业务逻辑
        $this->examine->delete($log_id);

        //完成
        redirect('/manage/LogsExamine');
    }

}