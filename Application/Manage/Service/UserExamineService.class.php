<?php

namespace Manage\Service;

use Manage\Model\UsersModel;
use Manage\Policies\Policies;

class UserExamineService
{
    protected $user;

    public function __construct()
    {
        //权限验证
        $this->policies = new Policies();
        $this->policies();

        //会员模型
        $this->user = new UsersModel();
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
    public function users($page, $num)
    {
        return $this->user->order('updated_at desc')->page($page.",$num")->select();
    }

    /**
     * 用户总量
     *
     * @return mixed
     */
    public function countUsers()
    {
        return $this->user->count();
    }

    /**
     * 激活用户
     * 禁止操作超级管理员
     *
     * @param $user_id
     * @return array
     */
    public function examine($user_id)
    {
        //禁止操作超级管理员
        if (can('isAdmin', [$user_id])) {
            throw new \Exception('请不要操作管理员帐号!');
        }

        //获取更新数组
        $map = $this->map($user_id, 0, 1);

        //更新数据
        $this->user->where('id = %d', $user_id)->save($map);
    }

    /**
     * 拉黑用户
     * 禁止操作超级管理员
     *
     * @param $user_id
     * @throws \Exception
     */
    public function close($user_id)
    {
        //禁止操作超级管理员
        if (can('isAdmin', [$user_id])) {
            throw new \Exception('请不要操作管理员帐号!');
        }

        //获取更新数组
        $map = $this->map($user_id, 0, 2);

        //更新数据
        $this->user->where('id = %d', $user_id)->save($map);
    }

    /**
     * 返回更新状态数组
     *
     * @param $user_id
     * @return int
     */
    public function map($user_id, $one, $two)
    {
        $status = $this->user->field('status')->where('id = %d', $user_id)->find()['status'] ? : 0;

        //定义用户新状态
        if ($status != $two) {
            $map['status'] = $two;
        } else if($status == $two) {
            $map['status'] = $one;
        }

        //设置更新时间
        $map['updated_at'] = date('Y-m-d H:i:s');

        return $map;
    }

    /**
     * 提升权限
     * 禁止操作超级管理员
     *
     * @param $user_id
     * @return bool
     * @throws \Exception
     */
    public function up($user_id)
    {
        //禁止操作超级管理员
        if (can('isAdmin', [$user_id])) {
            throw new \Exception('请不要操作管理员帐号!');
        }

        //获取分组
        $group = $this->user->field('group')->where('id = %d', $user_id)->find()['group'] ? : 4;

        //从配置文件获取最高权限参数
        $max = max(array_keys(C('POLICISE.LIST'))) - 1;
        $min = min(array_keys(C('POLICISE.LIST')));

        //修复异常数据
        if ($min <= $group && $group >= $max + 1 ) {
            $group = $min;
        }

        //权限未到最高
        if ($group < $max) {
            return $this->user->where('id = %d', $user_id)->save(['group' => $group + 1]);
        }

        throw new \Exception('再高就是超级管理员啦!');
    }

    /**
     * 降低权限
     * 禁止操作超级管理员
     *
     * @param $user_id
     * @return bool
     * @throws \Exception
     */
    public function down($user_id)
    {
        //禁止操作超级管理员
        if (can('isAdmin', [$user_id])) {
            throw new \Exception('请不要操作管理员帐号!');
        }

        //获取分组
        $group = $this->user->field('group')->where('id = %d', $user_id)->find()['group'] ? : 4;

        //从配置文件获取最高权限参数
        $max = max(array_keys(C('POLICISE.LIST')));
        $min = min(array_keys(C('POLICISE.LIST')));

        //修复异常数据
        if ($min <= $group && $group >= $max + 1 ) {
            $group = $min;
        }

        //权限未到最低
        if ($min < $group) {
            return $this->user->where('id = %d', $user_id)->save(['group' => $group - 1]);
        }

        throw new \Exception('再低就连会员都不是啦!');
    }

    /**
     * 统一方法
     *
     * @param $function
     */
    public function unified($function)
    {
        //获取用户id
        $user_id = I('get.id');

        //业务逻辑
        try{
            $this->$function($user_id);
        } catch (\Exception $e) {
            return response($e->getMessage(), 403);
        }

        //完成跳转
        redirect('/manage/UserExamine');
    }

    public function search($type, $value, $page, $num)
    {
        //条件
        $map['status'] = $type;
        $map['name'] = array('like',"%$value%");

        //获取结果
        $data =  $this->user
            ->where($map)
            ->order('updated_at desc')
            ->page($page.",$num")
            ->field('id, name, group, updated_at, status')
            ->select();

        $count = $this->user
            ->where($map)
            ->count();

        return ['data' => $data, 'count' => $count];
    }
}