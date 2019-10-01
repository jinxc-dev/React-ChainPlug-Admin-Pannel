import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import {
  Form,
  Input,
  DatePicker,
  Button,
  Card,
  Row,
  Col,
  Divider,
  Tabs,
  Table
  // Comment,
  // Avatar,
  // List,
  // Tooltip,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import StandardTable from '@/components/StandardTable';
import moment from 'moment';
import styles from './style.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
// const { Option } = Select;
// const { RangePicker } = DatePicker;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 16 },
  },
};
const commentLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 4 },
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 20 },
  },
};

const statusStyles = {
    requested: { backgroundColor: 'red' },
    'in-progress': { backgroundColor: 'dodgerblue' },
    assigned: { backgroundColor: 'orange' },
    'pending-contractor': { backgroundColor: 'lime' },
    approved: { backgroundColor: 'limegreen' },
    rejected: { backgroundColor: 'black', color: 'white' },
    cancelled: { backgroundColor: 'white', color: 'black' },
};
const paddingStyle = {
  padding: '0px 8px',
};

@connect(({ admin, certificates, loading }) => ({
  companies: admin.companies,
  users: admin.users,
  certificates,
  loading: loading.models.admin
}))
@Form.create()
class ApproveCerfiticateForm extends PureComponent {
    requestColumns = [
        {
          title: formatMessage({ id: 'certificate.state.label' }),
          dataIndex: 'state',
          width: 120,
          fixed: 'left',
          filters: [
            {
              text: formatMessage({ id: 'certificate.state.requested' }),
              value: 'requested',
            },
            {
              text: formatMessage({ id: 'certificate.state.assigned' }),
              value: 'assigned',
            },
            {
              text: formatMessage({ id: 'certificate.state.in-progress' }),
              value: 'in-progress',
            },
            {
              text: formatMessage({ id: 'certificate.state.approved' }),
              value: 'approved',
            },
            {
              text: formatMessage({ id: 'certificate.state.cancelled' }),
              value: 'cancelled',
            },
            {
              text: formatMessage({ id: 'certificate.state.rejected' }),
              value: 'rejected',
            },
          ],
          render(val) {
            return (
              <div style={{ ...statusStyles[val], ...{ borderRadius: '3px', textAlign: 'center' } }}>
                {formatMessage({ id: `certificate.state.${val}` })}
              </div>
            );
          },
        },
        {
          title: formatMessage({ id: 'certificate.task.id.label' }),
          dataIndex: 'taskId',
          fixed: 'left',
          width: 184,
          sorter: true
        },
        {
          title: formatMessage({ id: 'certificate.description.label' }),
          dataIndex: 'description',
          width: 280,
          sorter: true,
        },
        {
          title: formatMessage({ id: 'certificate.document.name.label' }),
          dataIndex: 'documentId',
          sorter: true
        },
        // {
        //   title: 'Authority Company',
        //   dataIndex: 'authorityCompany',
        //   sorter: true,
        // },
        {
          title: formatMessage({ id: 'certificate.requested.label' }),
          dataIndex: 'requestedBy',
          sorter: true,
        },
        {
          title: formatMessage({ id: 'certificate.assigned.label' }),
          dataIndex: 'assignedTo',
          sorter: true,
        },
        {
          title: formatMessage({ id: 'certificate.createdAt.label' }),
          dataIndex: 'createdAt',
          sorter: true,
          width: 160,
        },
        {
          title: formatMessage({ id: 'certificate.contractorcompany.label' }),
          dataIndex: 'contractorCompany',
          sorter: true,
        }
    ];
    
    userColumns = [
        {
          title: formatMessage({ id: 'certificate.name.label' }),
          dataIndex: 'username',
          fixed: 'left',
          sorter: true,
          width: 160,
        },
        {
          title: formatMessage({ id: 'certificate.company.id.label' }),
          dataIndex: 'companyId',
          sorter: true,
          width: 200,
        },
        {
          title: formatMessage({ id: 'app.settings.basic.email' }),
          dataIndex: 'email',
          sorter: true,
          width: 240,
        },
        {
          title: formatMessage({ id: 'app.settings.basic.phone' }),
          dataIndex: 'officePhone',
          sorter: true,
        }
    ];

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'admin/getCompanies',
        });
        dispatch({
            type: 'certificates/getTasks',
        });
        dispatch({
            type: 'admin/getUsers',
        });
    };

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        return;
        // const tbSort = sorter.field ? { field: sorter.field, order: sorter.order } : {};
        // const tbStatus = filtersArg.state ? filtersArg.state : [];
        // this.setState({ status: tbStatus, sorter: tbSort });
    };

    onPrev = () => {
        return;
        // router.push('/certification/documents');
    };

    onValidateForm = e => {
        e.preventDefault();
        return;
        // const { company, form, dispatch } = this.props;
        // const { validateFields } = form;
        // validateFields((err, fields) => {
        //   if (!err) {
        //     const values = {
        //       ...fields,
        //       expiryTime: fields.expiryTime.format('YYYY-MM-DD'),
        //       companyId: company.documentId,
        //     };
        //     dispatch({
        //       type: 'certificateForm/updatecompany',
        //       payload: values,
        //     });
        //   }
        // });
    };

    getCompanyInfo(){
        const { companies, match } = this.props;
        const { params: {id} } = match;
        
        let companyInfo = companies.filter(comp => comp.companyId === id);
        if(!companyInfo.length) return {};
        else return companyInfo[0];
    };

    getCompanyTasks(){
        const { certificates: {tasks}, match} = this.props;
        const { params: {id} } = match;

        let companyTasks = tasks
            .filter(task => task.authorityCompany === id || task.contractorCompany === id)
            .map((task, index) => {
                const eventCnt = task.events.length;
                return {
                    ...task,
                    createdAt: eventCnt ? moment(task.events[0].date).format('YYYY-MM-DD HH:mm:ss') : '',
                    key: index
                }
            });
        return companyTasks;
    };

    getCompanyUsers(){
        const { users, match} = this.props;
        const { params: {id} } = match;

        let companyUsers = users
            .filter(user => user.companyId === id)
            .map((user, index) => {
                return {
                    ...user,
                    username: user.firstName + ' ' + user.lastName,
                    key: index
                }
            });
        return companyUsers;
    };

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;

        let company = this.getCompanyInfo();
        let companyTasks = this.getCompanyTasks();
        let companyUsers = this.getCompanyUsers();
        
        return (
        <PageHeaderWrapper
            title={<FormattedMessage id="admin.company.details" />}
        >
            <Card bordered={false}>
            <Form hideRequiredMark style={{ marginTop: 8 }}>
                <Row>
                    <Col span={12} style={paddingStyle}>
                        <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="certificate.company.id.label" />}
                        >
                            <Input value={company.companyId} className={styles.disabled} disabled />
                        </FormItem>
                    </Col>
                    <Col span={12} style={paddingStyle}>
                        <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="certificate.name.label" />}
                        >
                            <Input value={company.name} className={styles.disabled} disabled />
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                <Col span={12} style={paddingStyle}>
                        <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="app.settings.basic.email" />}
                        >
                            <Input value={company.email} className={styles.disabled} disabled/>
                        </FormItem>
                    </Col>

                    <Col span={12} style={paddingStyle}>
                        <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="admin.type.label" />}
                        >
                            <Input value={company.type} className={styles.disabled} disabled />
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={12} style={paddingStyle}>
                        <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="admin.address.label" />}
                        >
                        <Input value={company.address} className={styles.disabled} disabled />
                        </FormItem>
                    </Col>
                    <Col span={12} style={paddingStyle}>
                        <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="certificate.createdAt.label" />}
                        >
                            <Input
                                value={moment(company.creationDate).format('YYYY-MM-DD')}
                                className={styles.disabled}
                                disabled
                            />
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={12} style={paddingStyle}>
                        <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="certificate.state.label" />}
                        >
                            <Input value={company.state} className={styles.disabled} disabled/>
                        </FormItem>
                    </Col>
                </Row>

                <Tabs tabPosition={'top'} style={{marginTop: '20px'}}>
                    <TabPane tab="Requested certificates" key="1">
                        <Table
                            dataSource={companyTasks}
                            columns={this.requestColumns}
                            onChange={this.handleStandardTableChange}
                            scroll={{ x: 1500 }}
                        />
                    </TabPane>
                    <TabPane tab="Users" key="2">
                        <Table
                            dataSource={companyUsers}
                            columns={this.userColumns}
                            onChange={this.handleStandardTableChange}
                            scroll={{ x: 1500 }}
                        />
                    </TabPane>
                    <TabPane tab="Tab 3" key="3">
                        Content of Tab 3
                    </TabPane>
                </Tabs>
            </Form>
            </Card>
        </PageHeaderWrapper>
        );
    }
}

export default ApproveCerfiticateForm;
