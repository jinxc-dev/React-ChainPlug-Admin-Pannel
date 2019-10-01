export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      // { path: '/', redirect: '/account/settings'},
      { path: '/', redirect: '/dashboard/analysis', authority: ['admin', 'user'] },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        visibleByRole: ['admin', 'authority', 'contractor'],
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'CertificateReport',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
            hideInMenu: true,
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
            hideInMenu: true,
          },
        ],
      },
      // certificate menu
      {
        path: '/certification',
        icon: 'form',
        name: 'certification',
        visibleByRole: ['admin', 'authority', 'contractor'],
        routes: [
          {
            path: '/certification/step-form',
            name: 'RequestCertification',
            component: './Certificates/RequestStepForm',
            visibleByRole: ['admin', 'contractor'],
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/certification/step-form',
                redirect: '/certification/step-form/info',
              },
              {
                path: '/certification/step-form/info',
                name: 'info',
                component: './Certificates/RequestStepForm/Step1',
              },
              {
                path: '/certification/step-form/confirm',
                name: 'confirm',
                component: './Certificates/RequestStepForm/Step2',
              },
              {
                path: '/certification/step-form/result',
                name: 'result',
                component: './Certificates/RequestStepForm/Step3',
              },
            ],
          },
          {
            path: '/certification/tasks',
            name: 'RequestedCertificate',
            component: './Certificates/CertificateTaskList',
          },
          {
            path: '/certification/approve_request/:id',
            name: 'ApproveRequest',
            component: './Certificates/ApproveRequestForm',
            hideInMenu: true,
          },
          {
            path: '/certification/create_certificate',
            name: 'CreateCertificate',
            component: './Certificates/CreateCertificateForm',
            visibleByRole: ['admin', 'authority'],
          },
          {
            path: '/certification/documents',
            name: 'Certificates',
            component: './Certificates/CertificateDocumentList',
          },
          {
            path: '/certification/approve_certificate/:id',
            name: 'ApproveCertificate',
            component: './Certificates/ApproveCerfiticateForm',
            hideInMenu: true,
          },
        ],
      },
      /////// blockchain menu
      {
        path: '/blockchain',
        icon: 'block',
        name: 'blockchain',
        visibleByRole: ['admin', 'authority', 'contractor'],
        routes: [
          {
            path: '/blockchain/iotlist',
            name: 'Blockchain',
            component: './Chains/BlockchainList',
          },
          {
            path: '/blockchain/blockchain_form/:id',
            name: 'form',
            component: './Chains/BlockchainForm',
            hideInMenu: true,
          },
          {
            path: '/blockchain/asset_management',
            name: 'AssetManagement',
            component: './Chains/BlockchainAssetManage',
          },
          {
            path: '/blockchain/asset_form/:id',
            name: 'AssetForm',
            component: './Chains/BlockchainAssetForm',
            hideInMenu: true,
          },
        ],
      },
      ///// coldchain menu
      {
        path: '/coldchain',
        icon: 'qrcode',
        name: 'coldchain',
        visibleByRole: ['admin', 'authority', 'contractor'],
        routes: [
          {
            path: '/coldchain/coldchainlist',
            name: 'Coldchain',
            component: './Chains/ColdchainList',
          },
          {
            path: '/coldchain/coldchain_form/:id',
            name: 'form',
            component: './Chains/ColdchainForm',
            hideInMenu: true,
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        hideInMenu: true,
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        hideInMenu: true,
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/basic/:id',
            name: 'basic',
            hideInMenu: true,
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            authority: ['admin'],
            component: './Profile/AdvancedProfile',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        hideInMenu: true,
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            hideInMenu: true,
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/resetpassword',
                component: './Account/Settings/ResetView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      ///////////// admin ////////////
      {
        path: '/admin',
        icon: 'user',
        name: 'admin',
        visibleByRole: ['authority'],
        routes: [
          {
            path: '/admin/users',
            name: 'users',
            routes: [
              {
                path: '/admin/users/userlist',
                name: 'userlist',
                component: './Admin/UserList'
              }    
            ]
          },
          {
            path: '/admin/companies',
            name: 'companies',
            routes: [
              {
                path: '/admin/companies/companylist',
                name: 'companylist',
                component: './Admin/CompanyList'
              },
              {
                path: '/admin/companies/companydetail/:id',
                name: 'companydetail',
                component: './Admin/CompanyDetailForm',
                hideInMenu: true,
              }    
            ]
          },
          {
            path: '/admin/consortium',
            name: 'consortium',
            routes: [
              {
                path: '/admin/consortium/newconsortium',
                name: 'newconsortium',
                component: './Admin/CreateConsortium'
              },
              {
                path: '/admin/consortium/consortiumlist',
                name: 'consortiumlist',
                component: './Admin/ConsortiumList'
              }    
            ]
          }
        ],
      },

      ///////////////  help   //////
      {
        path: '/help',
        name: 'help',
        component: './Help',
        hideInMenu: true,
      },
      {
        component: '404',
      },
    ],
  },
];
