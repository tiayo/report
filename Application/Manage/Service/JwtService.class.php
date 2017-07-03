<?php

namespace Manage\Service;

use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\ValidationData;

class JwtService
{

    /**
     * 生成token
     *
     * @param $user_id
     * @return \Lcobucci\JWT\Token
     * @throws \Exception
     */
    public function encode($user_id)
    {
        if (empty($user_id)) {
            throw new \Exception("No found user_id", 404);
        }

        $token = (new Builder())->setIssuer(C('JWT_URL')) // Configures the issuer (iss claim)
                                ->setAudience(C('JWT_URL')) // Configures the audience (aud claim)
                                ->setId(C('JWT_KEY'), true) // Configures the id (jti claim), replicating as a header item
                                ->setIssuedAt(time()) // Configures the time that the token was issue (iat claim)
                                ->setExpiration(time() + 3600*24*365*10) // 设置过期时间为(10年)
                                ->set('user_id', $user_id) // Configures a new claim, called "uid"
                                ->getToken(); // Retrieves the generated token

        return $token;
    }

    /**
     * 解析token
     *
     * @param $token
     * @return mixed
     * @throws \Exception
     */
    public function decode($token)
    {
        $token = (new Parser())->parse((string) $token); // Parses from a string

        $data = new ValidationData(); // It will use the current time to validate (iat, nbf and exp)
        $data->setIssuer(C('JWT_URL'));
        $data->setAudience(C('JWT_URL'));
        $data->setId(C('JWT_KEY'));

        if ($token->validate($data) === false) {
            throw new \Exception('token过期,请到后台刷新token!');
        }

        return $token->getClaim("user_id");
    }
}


