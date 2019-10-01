import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { login, getFakeCaptcha, refresh, pwdchange } from '@/services/api';
import { getEmail, getTokens, setAuthority, setEmail, setTokens, setRole } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);

      // Login successfully
      if (response) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: true,
            email: payload.email,
            ...response,
          },
        });

        reloadAuthorized();

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();

        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            redirect = null;
          }
        }

        if (response.state !== 'enabled') {
          redirect = '/account/settings';
        }

        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          role: 'guest',
          status: false,
          email: '',
          token: '',
          refreshToken: '',
        },
      });
      reloadAuthorized();

      // redirect
      if (window.location.pathname !== '/user/login') {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },

    *refresh(_, { call }) {
      const { refreshToken } = getTokens();

      const response = yield call(refresh, {
        email: getEmail(),
        refreshToken,
      });

      // Refreshed token successfully
      if (response) {
        setTokens({
          token: response.token,
          refreshToken,
        });

        window.setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    },

    *pwdchange({ payload }, { call }) {
      const response = yield call(pwdchange, payload);

      if (response !== undefined) {
        message.success('Success');
        // yield put(routerRedux.replace('/account/settings/base'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.role);
      setTokens(payload);
      setEmail(payload.email);
      setRole(payload);

      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
