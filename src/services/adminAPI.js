import request from '@/utils/request';
import { getTokens } from '@/utils/authority';

export async function getUsers() {
  return [
    {
      companyId: "CPCA002001",
      firstName: "Fed",
      lastName: "Mantega",
      email: "fedman78@gmail.com",
      officePhone: "123456789"
    },
    {
      companyId: "CPCC001001",
      firstName: "Zhang",
      lastName: "Ming",
      email: "Jmm2965943@outlook.com",
      officePhone: "123456789"
    },
    {
      companyId: "CPCA002001",
      firstName: "Hu",
      lastName: "Dailing",
      email: "hudaling773@gmail.com",
      officePhone: "123456789"
    }
  ];
  
    // const { token } = getTokens();
    // return request('/api/v1/IoTInBlockchains', {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'application/json',
    //   },
    //   method: 'Get',
    // });
  }
  export async function getCompanies() {
    return [
      {
        companyId: "CPCC001001",
        name: "comp_4",
        type: "contractor",
        address: "Street 4",
        state: "enabled",
        email: "testautcomp1@c.p",
        creationDate: "2019-04-25T16:11:13.657Z"
      },
      {
        companyId: "CPCA002001",
        name: "comp_5",
        type: "authority",
        address: "Street 5",
        state: "enabled",
        email: "testautcomp1@c.p",
        creationDate: "2019-04-25T16:11:13.657Z"
      },
      {
        companyId: "CPCC2F1111",
        name: "comp_1",
        type: "contractor",
        address: "Street 1",
        state: "enabled",
        email: "testautcomp1@c.p",
        creationDate: "2019-04-25T16:11:13.657Z"
      },
      {
        companyId: "CPCC2F2222",
        name: "comp_2",
        type: "authority",
        address: "Street 2",
        state: "disabled",
        email: "testautcomp1@c.p",
        creationDate: "2019-04-25T16:11:13.657Z"
      },
      {
        companyId: "CPCC2F3333",
        name: "comp_3",
        type: "authority",
        address: "Street 3",
        state: "enabled",
        email: "testautcomp1@c.p",
        creationDate: "2019-04-25T16:11:13.657Z"
      }
    ];
    // const { token } = getTokens();
    // return request('/api/v1/companies', {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'application/json',
    //   },
    //   method: 'Get',
    // });
  }
  export async function getConsortiums() {
    return [
      {
        companyId: "CPCC001001",
        name: "comp_4",
        type: "IoT",
        address: "Street 4",
        state: "enabled",
        creationDate: "2019-04-25T16:11:13.657Z"
      },
      {
        companyId: "CPCA002001",
        name: "comp_5",
        type: "ColdChain",
        address: "Street 5",
        state: "enabled",
        creationDate: "2019-04-25T16:11:13.657Z"
      },
      {
        companyId: "CPCC2F1111",
        name: "comp_1",
        type: "Certificate",
        address: "Street 1",
        state: "enabled",
        creationDate: "2019-04-25T16:11:13.657Z"
      },
      {
        companyId: "CPCC2F2222",
        name: "comp_2",
        type: "IoT",
        address: "Street 2",
        state: "disabled",
        creationDate: "2019-04-25T16:11:13.657Z"
      },
      {
        companyId: "CPCC2F3333",
        name: "comp_3",
        type: "ColdChain",
        address: "Street 3",
        state: "enabled",
        creationDate: "2019-04-25T16:11:13.657Z"
      }
    ];
  
    // const { token } = getTokens();
    // return request('/api/v1/IoTInBlockchains', {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'application/json',
    //   },
    //   method: 'Get',
    // });
  }
  export async function createConsortium() {
    return [];
  
    // const { token } = getTokens();
    // return request('/api/v1/IoTInBlockchains', {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'application/json',
    //   },
    //   method: 'Get',
    // });
  }