import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Icon, Button, Dropdown, Menu, DatePicker } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../List/TableList.less';

const FormItem = Form.Item;
const statusStyles = {
  requested: { backgroundColor: 'red' },
  'in-progress': { backgroundColor: 'dodgerblue' },
  assigned: { backgroundColor: 'orange' },
  'pending-contractor': { backgroundColor: 'lime' },
  approved: { backgroundColor: 'limegreen' },
  rejected: { backgroundColor: 'black', color: 'white' },
  cancelled: { backgroundColor: 'white', color: 'black' },
};
/* eslint react/no-multi-comp:0 */
@connect(({ certificates, loading }) => ({
  certificates,
  loading: loading.models.certificates,
}))
@Form.create()
class CertificateTaskList extends Component {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    status: [],
    sorter: {},
  };

  columns = [
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
      sorter: true,
      render: text => <a onClick={() => this.gotoApproveForm(text)}>{text}</a>,
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
      sorter: true,
      render: id => <div>{this.getDocumentName(id)}</div>,
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
      title: formatMessage({ id: 'certificate.updatedAt.label' }),
      dataIndex: 'updatedAt',
      sorter: true,
      width: 160,
    },
    {
      title: formatMessage({ id: 'certificate.contractorcompany.label' }),
      dataIndex: 'contractorCompany',
      sorter: true,
    },

    // {
    //   title: 'Contractor User',
    //   dataIndex: 'contractorUser',
    //   sorter: true,
    // },

    // {
    //   title: 'Actions',
    //   width: 150,
    //   render: (text, record) => (
    //     <Fragment>
    //       <a onClick={() => this.handleUpdateModalVisible(true, record)}>edit</a>
    //       <Divider type="vertical" />
    //       <a href="">remove</a>
    //     </Fragment>
    //   ),
    // },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'certificates/getTasks',
    });
    dispatch({
      type: 'certificates/getDocuments',
    });
  }

  getDocumentName(id) {
    const {
      certificates: { documents },
    } = this.props;
    if (!documents.length) return '';

    for (let i = 0; i < documents.length; i += 1) {
      if (documents[i].documentId === id) return documents[i].name;
    }
    return '';
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const tbSort = sorter.field ? { field: sorter.field, order: sorter.order } : {};
    const tbStatus = filtersArg.state ? filtersArg.state : [];
    this.setState({ status: tbStatus, sorter: tbSort });
  };

  gotoApproveForm = id => {
    router.push(`/certification/approve_request/${id}`);
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = () => {
    // const { selectedRows } = this.state;
    // if (selectedRows.length === 0) return;
    // switch (e.key) {
    //   case 'remove':
    //     dispatch({
    //       type: 'rule/remove',
    //       payload: {
    //         key: selectedRows.map(row => row.key),
    //       },
    //       callback: () => {
    //         this.setState({
    //           selectedRows: [],
    //         });
    //       },
    //     });
    //     break;
    //   default:
    //     break;
    // }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt ? fieldsValue.updatedAt.format('YYYY-MM-DD') : 0,
      };
      const newValues = Object.keys(values).reduce(
        (result, key) => (values[key] ? { ...result, [key]: values[key] } : result),
        {}
      );
      this.setState({ formValues: newValues });
    });
  };

  handleRedirect = () => {
    router.push('/certification/step-form');
  };

  isFechable(task) {
    const { formValues } = this.state;
    const terms = Object.keys(formValues);
    for (let i = 0; i < terms.length; i += 1) {
      const key = terms[i];
      if (!task[key].includes(formValues[key])) return false;
    }
    return true;
  }

  fechData() {
    const {
      certificates: { tasks },
    } = this.props;
    const { status } = this.state;
    const newTasks = tasks
      .map((task, index) => {
        const eventCnt = task.events.length;
        return {
          ...task,
          updatedAt: eventCnt
            ? moment(task.events[eventCnt - 1].date).format('YYYY-MM-DD HH:mm:ss')
            : '',
          createdAt: eventCnt ? moment(task.events[0].date).format('YYYY-MM-DD HH:mm:ss') : '',
          key: index,
        };
      })
      .filter(task => {
        let isValide = this.isFechable(task);
        if (status.length && !status.includes(task.state)) isValide = false;
        return isValide;
      });

    return newTasks;
  }

  sortData(data) {
    const {
      sorter: { field, order },
    } = this.state;
    if (!field) return data;
    if (order === 'ascend')
      data.sort((a, b) => {
        return b[field] > a[field] ? -1 : 1;
      });
    else
      data.sort((a, b) => {
        return a[field] > b[field] ? -1 : 1;
      });
    return data;

    // const { sorter } = this.state;
    // if (!sorter) return data;
    // if (sorter === 'ascend')
    //   data.sort((a, b) => {
    //     return a.updatedAt > b.updatedAt ? -1 : 1;
    //   });
    // else
    //   data.sort((a, b) => {
    //     return a.updatedAt < b.updatedAt ? -1 : 1;
    //   });
    // return data;
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="certificate.task.id.label" />}>
              {getFieldDecorator('taskId')(
                <Input placeholder={formatMessage({ id: 'certificate.task.id.validation' })} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="certificate.description.label" />}>
              {getFieldDecorator('description')(
                <Input placeholder={formatMessage({ id: 'certificate.description.validation' })} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="form.search" />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                <FormattedMessage id="form.reset" />
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                <FormattedMessage id="form.more" /> <Icon type="down" />{' '}
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="certificate.task.id.label" />}>
              {getFieldDecorator('taskId')(
                <Input placeholder={formatMessage({ id: 'certificate.task.id.validation' })} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="certificate.description.label" />}>
              {getFieldDecorator('description')(
                <Input placeholder={formatMessage({ id: 'certificate.description.validation' })} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="certificate.updatedAt.label" />}>
              {getFieldDecorator('updatedAt')(
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'certificate.updatedAt.validation' })}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label={<FormattedMessage id="certificate.authoritycompany.label" />}>
              {getFieldDecorator('authorityCompany')(
                <Input
                  placeholder={formatMessage({ id: 'certificate.authoritycompany.validation' })}
                />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label={<FormattedMessage id="certificate.requested.label" />}>
              {getFieldDecorator('requestedBy')(
                <Input placeholder={formatMessage({ id: 'certificate.requested.validation' })} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label={<FormattedMessage id="certificate.contractorcompany.label" />}>
              {getFieldDecorator('contractorCompany')(
                <Input
                  placeholder={formatMessage({ id: 'certificate.contractorcompany.validation' })}
                />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label={<FormattedMessage id="certificate.contractoruser.label" />}>
              {getFieldDecorator('contractorUser')(
                <Input
                  placeholder={formatMessage({ id: 'certificate.contractoruser.validation' })}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="form.search" />
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              <FormattedMessage id="form.reset" />
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              <FormattedMessage id="form.retract" /> <Icon type="up" />{' '}
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    console.log(this.props);
    const { loading } = this.props;
    const { selectedRows } = this.state;
    let fechData = this.fechData();
    if (fechData.length) fechData = this.sortData(fechData);
    const data = { list: fechData };
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">
          <FormattedMessage id="form.remove" />
        </Menu.Item>
      </Menu>
    );
    return (
      <PageHeaderWrapper title={<FormattedMessage id="certificate.list.request" />}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {/* <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>  New Document </Button> */}
              <Button icon="plus" type="primary" onClick={this.handleRedirect}>
                <FormattedMessage id="form.new" />
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  {/* <Button>批量操作</Button> */}
                  <Dropdown overlay={menu}>
                    <Button>
                      <FormattedMessage id="form.actions" />
                      <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 1500 }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default CertificateTaskList;
