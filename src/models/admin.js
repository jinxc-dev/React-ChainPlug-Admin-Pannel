import { getUsers, getCompanies, getConsortiums, createConsortium } from '@/services/adminAPI';

export default {
  namespace: 'admin',

  state: {
    users: [],
    companies: [],
    consortiums: []
  },

  effects: {
    *getUsers({ payload }, { call, put }) {
      const res = yield call(getUsers, payload);
      if (res) {
        yield put({
          type: 'userList',
          payload: res,
        });
      } else {
        yield put({
          type: 'userList',
          payload: [],
        });
      }
    },

    *getCompanies({ payload }, { call, put }) {
      const res = yield call(getCompanies, payload);
      if (res) {
        yield put({
          type: 'companyList',
          payload: res,
        });
      } else {
        yield put({
          type: 'companyList',
          payload: [],
        });
      }
    },

    *getConsortiums({ payload }, { call, put }) {
        const res = yield call(getConsortiums, payload);
        if (res) {
          yield put({
            type: 'consortiumList',
            payload: res,
          });
        } else {
          yield put({
            type: 'consortiumList',
            payload: [],
          });
        }
    },

    *createConsortium({ payload }, { call, put }) {
        const res = yield call(createConsortium, payload);
        if (res) {
            console.log('created consortium successfully!')
        } else {
            console.log('failed consortium.')
        }
    },
  },

  reducers: {
    userList(state, { payload }) {
      return {
        ...state,
        users: payload,
      };
    },
    companyList(state, { payload }) {
      return {
        ...state,
        companies: payload,
      };
    },
    consortiumList(state, { payload }) {
        return {
          ...state,
          consortiums: payload,
        };
      },
  },
};
