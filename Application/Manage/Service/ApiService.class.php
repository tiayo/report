<?php

namespace Manage\Service;

use Manage\Model\UsersModel;

class ApiService
{
    protected $user;
    protected $jwt;

    public function __construct()
    {
        $this->user = new UsersModel();
        $this->jwt = new JwtService();
    }

    public function user($token)
    {
        //解析用户id
        try{
            $user_id = $this->jwt->decode($token);
        } catch (\Exception $e) {
            throw new \Exception('token解析失败!请到后台获取新的token!');
        }

        //获取用户token
        $user = $this->user->field('id, remember_token, status')->where('id = %d', $user_id)->find();

        //验证用户状态
        if ($user['status'] != 1) {
            throw new \Exception('用户状态为未通过审核，请稍等!');
        }

        //判断token是否一致
        if ($user['remember_token'] !== $token)  {
            throw new \Exception('token失效了!请到后台获取最新的token!');
        }

        //请求次数加1
        $this->user->where('id = %d', $user_id)->setInc('requency', 1);

        //返回验证成功
        return $user['id'];
    }

    /**
     * 获取Bearer token
     *
     * @return mixed
     */
    public function bearerToken()
    {
        $header = I('server.HTTP_AUTHORIZATION');

        if ($this->startsWith($header, 'Bearer ')) {
            return $this->substr($header, 7);
        }
    }

    /**
     * 验证是否为Bearer
     *
     * @param $haystack
     * @param $needles
     * @return bool
     */
    public function startsWith($haystack, $needles)
    {
        foreach ((array) $needles as $needle) {
            if ($needle != '' && substr($haystack, 0, strlen($needle)) === (string) $needle) {
                return true;
            }
        }

        return false;
    }

    /**
     * 切字符
     *
     * @param $string
     * @param $start
     * @param null $length
     * @return string
     */
    public static function substr($string, $start, $length = null)
    {
        return mb_substr($string, $start, $length, 'UTF-8');
    }
}