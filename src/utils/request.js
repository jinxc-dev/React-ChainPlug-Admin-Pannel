/**
 * request 网络请求工具
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import router from 'umi/router';

/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response = {} } = error;
  const { status } = response;
  const { pathname } = window.location;

  // Display error message, if it exists

  if (status === 401) {
    if( pathname.includes('user/register') || pathname.includes('user/login')){
      notification.error({
        ...error.data,
      });
    }else if ( error.data.message === 'refresh token expired' || error.data.message === 'invalid refresh token' ) {
      window.g_app._store.dispatch({
        type: 'login/logout',
      });
    } else if (error.data.message === 'Invalid Token') {
      window.g_app._store.dispatch({
        type: 'login/refresh',
      });
    }

    return;
  }

  if (status === 400) {
    if (error.data.message === 'email or refreshToken missing') return;
    notification.error({
      ...error.data,
    });
    // notification.error({
    //   ...{ message: 'request failed' },
    // });
    return;
  }

  if (error.data.message) {
    notification.error({
      ...error.data,
    });
  }

  // environment should not be used
  if (status === 403) {
    router.push('/exception/403');
    return;
  }

  if (status <= 504 && status >= 500) {
    router.push('/exception/500');
    return;
  }

  if (status >= 404 && status < 422) {
    router.push('/exception/404');
  }
};

const request = extend({
  credentials: 'include',
  errorHandler,
});

export default request;
