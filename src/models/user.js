import { queryUser, updateUser } from '@/services/user';
import { getEmail, setRole, setAuthority, getRole } from '@/utils/authority';
import { message } from 'antd';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const email = getEmail();

      let response = yield call(queryUser, { email });

      // If user isn't enabled, the response is `undefined`
      if (!response) {
        response = { email };
      }

      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *update({ payload }, { call, put }) {
      const email = getEmail();
      const userRole = getRole();
      const res = yield call(updateUser, payload);
      
      if (res != undefined && payload.companyId) {
        message.success('Success');
        const response = {
          ...payload,
          email,
          companyType: 'contractor',
          role: 'user',
          state: 'enabled',
        };
        yield put({
          type: 'updateCurrentUser',
          payload: response,
        });
        if (userRole === 'user') window.location.reload();
      }
      // else message.error('Fail')
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    updateCurrentUser(state, action) {
      setAuthority(action.payload.role);
      setRole(action.payload);
      const { currentUser } = state;
      const newUser = { ...currentUser, ...action.payload };

      return {
        ...state,
        currentUser: newUser,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
