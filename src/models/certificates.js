import { getCompanyTasks, getCompanyDocuments } from '@/services/api';

export default {
  namespace: 'certificates',

  state: {
    tasks: [],
    documents: [],
  },

  effects: {
    *getTasks({ payload }, { call, put }) {
      const res = yield call(getCompanyTasks, payload);
      if (res) {
        yield put({
          type: 'taskList',
          payload: res,
        });
      } else {
        yield put({
          type: 'taskList',
          payload: [],
        });
      }
    },

    *getDocuments({ payload }, { call, put }) {
      const res = yield call(getCompanyDocuments, payload);
      if (res) {
        yield put({
          type: 'documentList',
          payload: res,
        });
      } else {
        yield put({
          type: 'documentList',
          payload: [],
        });
      }
    },
  },

  reducers: {
    taskList(state, { payload }) {
      return {
        ...state,
        tasks: payload,
      };
    },
    documentList(state, { payload }) {
      return {
        ...state,
        documents: payload,
      };
    },
  },
};
