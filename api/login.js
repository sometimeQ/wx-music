import network from './index';


/**
 * 登陆接口
 */
export function login(userPhone, md5_password) {
  return network.POST('/login/cellphone', { 
    phone: userPhone,
    md5_password
  });
}