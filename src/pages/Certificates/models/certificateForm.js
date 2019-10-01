import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  createTask,
  updateTask,
  getTaskById,
  createDocument,
  updateDocument,
  getDocumentById,
  sendDocumentFile
} from '@/services/api';

export default {
  namespace: 'certificateForm',

  state: {
    step: {
      certificateType: 'ISO 9000',
      description: '',
      response: null,
    },
    task: {},
    document: {}
  },

  effects: {
    *submitTaskInfo({ payload }, { call, put }) {
      const res = yield call(createTask, payload);
      if (res && res.taskId) {
        yield put({
          type: 'saveStepFormData',
          payload: { response: res },
        });
        yield put(routerRedux.push('/certification/step-form/result'));
      }
    },
    *updateTaskInfo({ payload }, { call, put }) {
      const res = yield call(updateTask, payload);
      if (res !== undefined) {
        yield put(routerRedux.push('/certification/tasks'));
      }
    },
    *postTaskComment({ payload }, { call, put }) {
      const response = yield call(updateTask, payload);
      if (response !== undefined) {
        const res = yield call(getTaskById, payload);
        if (res && res.taskId) {
          yield put({
            type: 'saveTaskInfo',
            payload: res,
          });
        }
      }
    },
    *getTaskInfo({ payload }, { call, put }) {
      const res = yield call(getTaskById, payload);
      if (res && res.taskId) {
        yield put({
          type: 'saveTaskInfo',
          payload: res,
        });
      }
    },
    *initDocInfo({payload}, {call, put}){
      yield put({
        type: 'saveDocInfo',
        payload: payload,
      });
    },
    *submitDocInfo({ payload }, { call, put }) {
      const res = yield call(createDocument, payload);
      if (res && res.documentId) {
        console.log(res, 'actions');
        yield put({
          type: 'saveDocInfo',
          payload: res,
        });
      }

      // if (res && res.cpid) {
      //   message.success('Success');
      // } else {
      //   message.error(res.message);
      // }
    },
    *sendDocFile({ payload }, { call, put }) {
      const res = yield call(sendDocumentFile, payload);
    },
    *updateDocInfo({ payload }, { call, put }) {
      const res = yield call(updateDocument, payload);
      if (res !== undefined) {
        yield put(routerRedux.push('/certification/documents'));
      }
    },
    *postDocComment({ payload }, { call, put }) {
      const response = yield call(updateDocument, payload);
      if (response !== undefined) {
        const res = yield call(getDocumentById, payload);
        if (res && res.documentId) {
          yield put({
            type: 'saveDocInfo',
            payload: res,
          });
        }
      }
    },
    *getDocInfo({ payload }, { call, put }) {
      const res = yield call(getDocumentById, payload);
      if (res && res.documentId) {
        yield put({
          type: 'saveDocInfo',
          payload: res,
        });
      }
    },
  },

  reducers: {
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
    saveTaskInfo(state, { payload }) {
      return {
        ...state,
        task: payload,
      };
    },
    saveDocInfo(state, { payload }) {
      console.log(payload, 'reducer');
      return {
        ...state,
        document: payload,
      };
    },
  },
};
