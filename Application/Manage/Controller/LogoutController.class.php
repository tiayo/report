<?php

namespace Manage\Controller;

use Manage\Middleware\Guest;
use Think\Controller;

class LogoutController extends Controller
{
    public function index()
    {
        if (!Guest::check()) {
            //清除session
            session(null);
        }

        redirect('/manage/login');
    }
}




