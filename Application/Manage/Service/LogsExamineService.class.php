<?php

namespace Manage\Service;

use Manage\Model\LogsModel;
use Manage\Policies\Policies;

class LogsExamineService
{
    protected $logs;

    public function __construct()
    {
        //权限验证
        $this->policies = new Policies();
        $this->policies();

        //异常记录模型
        $this->logs = new LogsModel();
    }

    /**
     * 权限验证(此控制器只有超级管理员可以操作)
     *
     * @return mixed
     */
    public function policies()
    {
        if (!$this->policies->isAdmin(session('user.id'))) {
            return response('不允许操作!', 403);
        }
    }

    /**
     * 获取用户
     *
     * @param $page
     * @return array
     */
    public function logs($page, $num)
    {
        return $this->logs->order('updated_at desc')->page($page.",$num")->select();
    }

    /**
     * 用户总量
     *
     * @return mixed
     */
    public function countLogs()
    {
        return $this->logs->count();
    }

    /**
     * 审核异常记录
     *
     * @param $user_id
     * @return array
     */
    public function examine($log_id)
    {
        //获取更新数组
        $map = $this->map($log_id, 0, 1);

        //更新数据
        $this->logs->where('id = %d', $log_id)->save($map);
    }

    /**
     * 返回更新状态数组
     *
     * @param $user_id
     * @return array
     */
    public function map($log_id, $one, $two)
    {
        $status = $this->logs->field('status')->where('id = %d', $log_id)->find()['status'] ? : 0;

        //更新时间
        $map['updated_at'] = date('Y-m-d H:i:s');

        //定义用户新状态
        if ($status != $two) {
            $map['status'] = $two;
        } else if($status == $two) {
            $map['status'] = $one;
        }

        return $map;
    }

    /**
     * 统一方法
     *
     * @param $function
     */
    public function unified($function)
    {
        //获取用户id
        $log_id = I('get.id');

        //业务逻辑
        try{
            $this->$function($log_id);
        } catch (\Exception $e) {
            return response($e->getMessage(), 403);
        }

        //完成跳转
        redirect('/manage/LogsExamine');
    }

    public function search($type, $value, $column, $page, $num)
    {
        //条件
        $map['status'] = $type;
        $map[$column] = array('like',"%$value%");

        //获取结果
        $data = $this->logs
            ->where($map)
            ->order('updated_at desc')
            ->page($page.",$num")
            ->select();

        $count = $this->logs
            ->where($map)
            ->count();

        return ['data' => $data, 'count' => $count];
    }

    public function delete($log_id)
    {
        return $this->logs->where('id = %d', $log_id)->delete();
    }
}