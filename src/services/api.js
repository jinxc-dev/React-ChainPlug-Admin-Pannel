import { stringify } from 'qs';
import request from '@/utils/request';
import { getTokens } from '@/utils/authority';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

export async function login(params) {
  return request('/api/v1/auth/login', {
    headers: {
      Authorization: `Basic ${window.btoa(`${params.email}:${params.password}`)}`,
    },
    method: 'GET',
  });
}

export async function register(params) {
  return request('/api/v1/auth/register', {
    method: 'POST',
    data: params,
  });
}

export async function refresh(params) {
  return request('/api/v1/auth/refresh', {
    method: 'POST',
    data: params,
  });
}

export async function pwdchange(params) {
  const { token } = getTokens();
  return request('/api/v1/auth/pwdchange', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'Post',
    data: params,
  });
}

export async function createTask(params) {
  const { token } = getTokens();
  return request('/api/v1/tasks', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'Post',
    data: params,
  });
}

export async function updateTask(params) {
  const { token } = getTokens();
  return request(`/api/v1/tasks/${params.taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'Patch',
    data: params,
  });
}

export async function getTaskById(params) {
  const { token } = getTokens();
  return request(`/api/v1/tasks/${params.taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'Get',
  });
}

export async function getCompanyTasks() {
  const { token } = getTokens();
  return request('/api/v1/tasks', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'Get',
  });
}

export async function createDocument(params) {
  const { token } = getTokens();
  return request('/api/v1/documents', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'Post',
    data: params,
  });
}

export async function sendDocumentFile(params) {
  const { token } = getTokens();
  const {docId, formData} = params;
  console.log(formData)
  return request(`/api/v1/documents/file/${docId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    method: 'Post',
    data: formData
  });
}

export async function updateDocument(params) {
  const { token } = getTokens();
  const { documentId } = params;
  return request(`/api/v1/documents/${documentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'Patch',
    data: params,
  });
}

export async function getDocumentById(params) {
  const { token } = getTokens();
  return request(`/api/v1/documents/${params.documentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'Get',
  });
}

export async function getCompanyDocuments() {
  const { token } = getTokens();
  return request('/api/v1/documents', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'Get',
  });
}



const blockchains = [
  {
      "block_data": {
          "tx_id": "00a7b0cabb4360f5dedbd5316150602aafddf5af619c649e3b3864007d4d0946",
          "idSens": "tester",
          "type": "newIotblock",
          "idEVent": 1,
          "buffer": 2,
          "criticality": 6,
          "payload": []
      },
      "previous_hash": "c557cb6eb4a9c0f1b4ed6ec693409e700b217a2569794cd894d2c2d03118a9cd",
      "current_hash": "dadbcc708dc3c378bfdb17395c9d89370d73f6c6dfa2c6873844b2af91ce2e2b",
      "blockNumber": "21"
  },
  {
      "block_data": {
          "tx_id": "e6a3a15bf13ae07ee1cb8dc064fe6cf75564f6e710bfa50094c7fb176a051d28",
          "idSens": "iot-hemant",
          "type": "hemant",
          "idEVent": 4,
          "buffer": 11,
          "criticality": 4,
          "payload": []
      },
      "previous_hash": "2d347955d18a551693a89522ae346aeb5fa0ae836083c822f87b754a708903f8",
      "current_hash": "7a79d42221d00e51682c9a0477c851fb32c3298d45afc534ccba35f21b64c9ca",
      "blockNumber": "14"
  },
  {
      "block_data": {
          "tx_id": "1858e7cd149fef706ec836ed8c067ec97edd2d698a9642710fbe508040f421df",
          "idSens": "6524iot",
          "type": "newIotblock",
          "idEVent": 1,
          "buffer": 2,
          "criticality": 4,
          "payload": []
      },
      "previous_hash": "aecda36bb82dd03b595a94b755ba2afae72a8b911edb16b9b5bf8fb64913319d",
      "current_hash": "1851ffee8d68e86d2128dea886afba5cbdd8f7d76e9350d0a31dbad50e249874",
      "blockNumber": "8"
  }]

export async function getIoTInBlockchains() {
  // return blockchains;
  const { token } = getTokens();
  return request('http://ec2-3-15-165-76.us-east-2.compute.amazonaws.com:8082/rest/getAllBlockData', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'Get',
  });
}

export async function getIoTInBlockchain(params) {
  return {
    "block_data": {
        "tx_id": "6bc994cdc495127a7dc5d826b907c900c7f970b64729cd1420399372ab9d15a1",
        "idSens": "6524iot",
        "type": "newIotblock",
        "idEVent": 1,
        "buffer": 2,
        "criticality": 4,
        "payload": []
    },
    "previous_hash": "23aa61f2ce552a8bf30bf8f634f87198cf3c3b1ef5e7c56701e2b4b673cbff38",
    "current_hash": "5fb10b1440e5a4c615aeb828c38e27f60bec7578b827b1e2eeaf3a58927bf44c",
    "blockNumber": "7",
    "tx_id": "6bc994cdc495127a7dc5d826b907c900c7f970b64729cd1420399372ab9d15a1"
}

  // const { token } = getTokens();
  // return request(`http://ec2-3-15-165-76.us-east-2.compute.amazonaws.com:8082/rest/getBlockData/${params.chainId}`, {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //     'Content-Type': 'application/json',
  //   },
  //   method: 'Get',
  // });
}

const dummys = [
  {
    idSens: 'sens001',
    date: '2019-08-05',
    type: 'Temp',
    idEvent: 'ev001',
    buffer: 10,
    severity: 'Normal',
    payload: ['000000000000', '1111111111111', 'aaaaaaaaaaaaaaaa'],
  },
  {
    idSens: 'sens002',
    date: '2019-08-27',
    type: 'Mov',
    idEvent: 'ev002',
    buffer: 20,
    severity: 'Critical',
    payload: ['000000000000', '1111111111111', 'aaaaaaaaaaaaaaaa'],
  },
  {
    idSens: 'sens003',
    date: '2019-08-23',
    type: 'Press',
    idEvent: 'ev003',
    buffer: 30,
    severity: 'Critical',
    payload: ['000000000000', '1111111111111', 'aaaaaaaaaaaaaaaa'],
  },
];

export async function getColdchains() {
  return dummys;

  // const { token } = getTokens();
  // return request('/api/v1/coldchains', {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //     'Content-Type': 'application/json',
  //   },
  //   method: 'Get',
  // });
}

export async function getColdchain(params) {
  let dummy;
  dummys.forEach(data => {
    if (data.idSens === params.chainId) dummy = data;
  });
  return dummy;

  // const { token } = getTokens();
  // return request(`/api/v1/coldchain/${params.chainId}`, {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //     'Content-Type': 'application/json',
  //   },
  //   method: 'Get',
  // });
}

const dummyAssets = [
  {
    id: 'sens001',
    name: 'Sens001',
    type: 'Temp',
    longitude: 147.154312,
    latitude: -31.56391,
    description: 'this is sens001',
    date: '2019-08-05',
  },
  {
    id: 'sens002',
    name: 'Sens002',
    type: 'Temp',
    longitude: 150.363181,
    latitude: -33.718234,
    description: 'this is sens002',
    date: '2019-08-05',
  },
  {
    id: 'sens003',
    name: 'Sens003',
    type: 'Temp',
    longitude: 150.371124,
    latitude: -33.727111,
    description: 'this is sens003',
    date: '2019-08-05',
  },
];

const dummyEvents = [
  {
    idSens: 'sens001',
    date: '2019-08-05',
    type: 'Temp',
    idEvent: 'ev001',
    buffer: 10,
    severity: 'Normal',
    payload: ['000000000000', '1111111111111', 'aaaaaaaaaaaaaaaa'],
    events: [],
  },
  {
    idSens: 'sens002',
    date: '2019-08-27',
    type: 'Mov',
    idEvent: 'ev002',
    buffer: 20,
    severity: 'Critical',
    payload: ['000000000000', '1111111111111', 'aaaaaaaaaaaaaaaa'],
    events: [],
  },
  {
    idSens: 'sens003',
    date: '2019-08-23',
    type: 'Press',
    idEvent: 'ev003',
    buffer: 30,
    severity: 'Critical',
    payload: ['000000000000', '1111111111111', 'aaaaaaaaaaaaaaaa'],
    events: [],
  },
  {
    idSens: 'sens001',
    date: '2019-08-05',
    type: 'Temp',
    idEvent: 'ev004',
    buffer: 10,
    severity: 'Normal',
    payload: ['000000000000', '1111111111111', 'aaaaaaaaaaaaaaaa'],
    events: [],
  },
  {
    idSens: 'sens001',
    date: '2019-08-27',
    type: 'Mov',
    idEvent: 'ev005',
    buffer: 20,
    severity: 'Critical',
    payload: ['000000000000', '1111111111111', 'aaaaaaaaaaaaaaaa'],
    events: [],
  },
  {
    idSens: 'sens001',
    date: '2019-08-23',
    type: 'Press',
    idEvent: 'ev006',
    buffer: 30,
    severity: 'Critical',
    payload: ['000000000000', '1111111111111', 'aaaaaaaaaaaaaaaa'],
    events: [],
  },

  {
    idSens: 'sens003',
    date: '2019-08-23',
    type: 'Press',
    idEvent: 'ev007',
    buffer: 30,
    severity: 'Critical',
    payload: ['000000000000', '1111111111111', 'aaaaaaaaaaaaaaaa'],
    events: [],
  },
  {
    idSens: 'sens003',
    date: '2019-08-05',
    type: 'Temp',
    idEvent: 'ev008',
    buffer: 10,
    severity: 'Normal',
    payload: ['000000000000', '1111111111111', 'aaaaaaaaaaaaaaaa'],
    events: [],
  },
  {
    idSens: 'sens003',
    date: '2019-08-27',
    type: 'Mov',
    idEvent: 'ev009',
    buffer: 20,
    severity: 'Critical',
    payload: ['000000000000', '1111111111111', 'aaaaaaaaaaaaaaaa'],
    events: [],
  },
  {
    idSens: 'sens003',
    date: '2019-08-23',
    type: 'Press',
    idEvent: 'ev010',
    buffer: 30,
    severity: 'Critical',
    payload: ['000000000000', '1111111111111', 'aaaaaaaaaaaaaaaa'],
    events: [],
  },

  {
    idSens: 'sens003',
    date: '2019-08-23',
    type: 'Press',
    idEvent: 'ev011',
    buffer: 30,
    severity: 'Critical',
    payload: ['000000000000', '1111111111111', 'aaaaaaaaaaaaaaaa'],
    events: [],
  },
  {
    idSens: 'sens003',
    date: '2019-08-05',
    type: 'Temp',
    idEvent: 'ev012',
    buffer: 10,
    severity: 'Normal',
    payload: ['000000000000', '1111111111111', 'aaaaaaaaaaaaaaaa'],
    events: [],
  },
  {
    idSens: 'sens002',
    date: '2019-08-27',
    type: 'Mov',
    idEvent: 'ev013',
    buffer: 20,
    severity: 'Critical',
    payload: ['000000000000', '1111111111111', 'aaaaaaaaaaaaaaaa'],
    events: [],
  },
  {
    idSens: 'sens002',
    date: '2019-08-23',
    type: 'Press',
    idEvent: 'ev014',
    buffer: 30,
    severity: 'Critical',
    payload: ['000000000000', '1111111111111', 'aaaaaaaaaaaaaaaa'],
    events: [],
  },
];
export async function getBlockchainAssets() {
  return dummyAssets;

  // const { token } = getTokens();
  // return request('/api/v1/IoTInBlockchains', {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //     'Content-Type': 'application/json',
  //   },
  //   method: 'Get',
  // });
}

export async function getBlockchainAsset(params) {
  let aseet;
  dummyAssets.forEach(data => {
    if (data.id === params.chainId) aseet = data;
  });
  const events = dummyEvents.filter(event => params.chainId === event.idSens);
  return { ...aseet, events };

  // const { token } = getTokens();
  // return request(`/api/v1/IoTInBlockchain/${params.chainId}`, {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //     'Content-Type': 'application/json',
  //   },
  //   method: 'Get',
  // });
}

