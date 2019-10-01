import { getBlockchainAssets, getBlockchainAsset } from '@/services/api';

export default {
  namespace: 'assets',

  state: {
    BlockchainAssets: [],
    BlockchainAsset: {},
  },

  effects: {
    *getBlockchainAssets({ payload }, { call, put }) {
      const res = yield call(getBlockchainAssets, payload);
      if (res) {
        yield put({
          type: 'blockchainAssets',
          payload: res,
        });
      } else {
        yield put({
          type: 'blockchainAssets',
          payload: [],
        });
      }
    },
    *getBlockchainAsset({ payload }, { call, put }) {
      const res = yield call(getBlockchainAsset, payload);
      if (res) {
        yield put({
          type: 'saveBlockchainAsset',
          payload: res,
        });
      } else {
        yield put({
          type: 'saveBlockchainAsset',
          payload: {},
        });
      }
    },
  },

  reducers: {
    blockchainAssets(state, { payload }) {
      return {
        ...state,
        BlockchainAssets: payload,
      };
    },
    saveBlockchainAsset(state, { payload }) {
      return {
        ...state,
        BlockchainAsset: payload,
      };
    },
  },
};
