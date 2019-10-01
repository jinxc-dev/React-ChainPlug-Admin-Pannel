import {
  getIoTInBlockchains,
  getIoTInBlockchain,
  getColdchains,
  getColdchain,
} from '@/services/api';

export default {
  namespace: 'chains',

  state: {
    IoTInBlockchains: [],
    coldchains: [],
    blockchain: {},
    coldchain: {},
  },

  effects: {
    *getBlockchains({ payload }, { call, put }) {
      const res = yield call(getIoTInBlockchains, payload);
      if (res) {
        yield put({
          type: 'blockchainList',
          payload: res,
        });
      } else {
        yield put({
          type: 'blockchainList',
          payload: [],
        });
      }
    },
    *getBlockchain({ payload }, { call, put }) {
      const res = yield call(getIoTInBlockchain, payload);
      if (res) {
        yield put({
          type: 'saveBlockchain',
          payload: res,
        });
      } else {
        yield put({
          type: 'saveBlockchain',
          payload: {},
        });
      }
    },

    *getColdchains({ payload }, { call, put }) {
      const res = yield call(getColdchains, payload);
      if (res) {
        yield put({
          type: 'coldchainList',
          payload: res,
        });
      } else {
        yield put({
          type: 'coldchainList',
          payload: [],
        });
      }
    },
    *getColdchain({ payload }, { call, put }) {
      const res = yield call(getColdchain, payload);
      if (res) {
        yield put({
          type: 'saveColdchain',
          payload: res,
        });
      } else {
        yield put({
          type: 'saveColdchain',
          payload: {},
        });
      }
    },
  },

  reducers: {
    blockchainList(state, { payload }) {
      return {
        ...state,
        IoTInBlockchains: payload,
      };
    },
    saveBlockchain(state, { payload }) {
      return {
        ...state,
        blockchain: payload,
      };
    },
    coldchainList(state, { payload }) {
      return {
        ...state,
        coldchains: payload,
      };
    },
    saveColdchain(state, { payload }) {
      return {
        ...state,
        coldchain: payload,
      };
    },
  },
};
