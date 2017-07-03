<?php

namespace Manage\Service;

use Manage\Model\LogsModel;
use Manage\Model\UsersModel;

class LogsService
{
    protected $logs;
    protected $jwt;
    protected $users;

    public function __construct()
    {
        $this->logs = new LogsModel();
        $this->jwt = new JwtService();
        $this->users = new UsersModel();
    }

    /**
     * 搜素
     *
     * @param $type
     * @param $value
     * @return string
     */
    public function search($user_type, $type, $value)
    {
        //非超级管理员强制条件(只能搜索状态1[审核通过]的信息)
        if (!can('isAdmin', [session('user.id')])) {
            $map['status'] = 1;
        }

        //条件
//        if (!empty($user_type)) {
//            $map['user_type'] = $user_type;
//        }
        $map[$type] = array('like',"%$value%");

        //获取结果
        return $this->logs
            ->field('id, name, phone, email, idcardnumber, user_type, ip_address, remark, user_address')
            ->where($map)
            ->select();
    }

    /**
     * 添加数据
     *
     * @param $map
     * @return mixed
     * @throws \Exception
     */
    public function createPost($post, $user_id = null)
    {
        //写入发布者id
        $map['publisher_id'] = $post['publisher_id']  = empty($user_id) ? session('user.id') : $user_id;

        //自动验证
        if (!$this->logs->create($post)) {
            throw new \Exception($this->logs->getError());
        }

        //获取需要的数据
        $map['name'] = $post['name'] ? : null;
        $map['phone'] = $post['phone'] ? : null;
        $map['email'] = $post['email'] ? : null;
        $map['user_type'] = $post['user_type'] ? : null;
        $map['ip_address'] = $post['ip_address'] ? : null;
        $map['idcardnumber'] = $post['idcardnumber'] ? : null;
        $map['user_address'] = $post['user_address'] ? : null;
        $map['remark'] = $post['remark'] ? : null;

        //卸载空项目
        foreach ($map as $key => $item) {
            if ($item == null) {
                unset($map[$key]);
            }
        }

        //防止数据重复提交
        if ($this->logs->where($map)->count() > 0) {
            throw new \Exception('您已经提交过该条数据了,请勿重复提交!');
        }

        //添加时间
        $map['created_at'] = date('Y-m-d H:i:s');
        $map['updated_at'] = date('Y-m-d H:i:s');

        //插入数据
        return $this->logs->add($map);
    }

    /**
     * 获取token
     *
     * @param $user_id
     * @return null|string
     */
    public function token($user_id)
    {
        //获取存储的token
        $token = $this->users->field('remember_token')->where('id=%d', $user_id)->find()['remember_token'] ? : null;

        //生成token
        if (empty($token)) {
            $token = $this->generate($user_id);
        }

        return $token;
    }

    /**
     * 生成token
     *
     * @param $user_id
     * @return string
     */
    public function generate($user_id)
    {
        //生成token
        $token = (string) $this->jwt->encode($user_id);

        //更新数据
        $data['remember_token'] = $token;
        $data['updated_time'] = date('Y-m-d H:i:s');

        //记录到数据库
        $this->users->where('id=%d', $user_id)->save($data);

        //返回token
        return $token;
    }

    /**
     * 获取api请求次数
     *
     * @param $user_id
     * @return int
     */
    public function requency($user_id)
    {
        return $this->users->field('requency')->where('id = %d', $user_id)->find()['requency'] ? : 0;
    }
}