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
// const { TextArea } = Input;
const statusStyles = {
  draft: { backgroundColor: '#e8e8e8' },
  approved: { backgroundColor: 'green', color: 'white' },
  finalized: { backgroundColor: 'blue', color: 'white' },
  cancelled: { backgroundColor: 'red', color: 'white' },
};
/* eslint react/no-multi-comp:0 */
@connect(({ certificates, loading }) => ({
  certificates,
  loading: loading.models.certificates,
}))
@Form.create()
class CertificateDocumentList extends Component {
  state = {
    expandForm: false,
    selectedRows: [],
    status: [],
    sorter: {},
    formValues: {},
  };

  columns = [
    {
      title: formatMessage({ id: 'certificate.state.label' }),
      dataIndex: 'state',
      width: 120,
      fixed: 'left',
      filters: [
        {
          text: formatMessage({ id: 'certificate.state.draft' }),
          value: 'draft',
        },
        {
          text: formatMessage({ id: 'certificate.state.approved' }),
          value: 'approved',
        },
        {
          text: formatMessage({ id: 'certificate.state.finalized' }),
          value: 'finalized',
        },
        {
          text: formatMessage({ id: 'certificate.state.cancelled' }),
          value: 'cancelled',
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
      title: formatMessage({ id: 'certificate.document.id.label' }),
      dataIndex: 'documentId',
      fixed: 'left',
      sorter: true,
      width: 160,
      render: text => <a onClick={() => this.gotoApproveForm(text)}>{text}</a>,
    },
    {
      title: formatMessage({ id: 'certificate.name.label' }),
      dataIndex: 'name',
      sorter: true,
      width: 120,
    },
    {
      title: formatMessage({ id: 'certificate.description.label' }),
      dataIndex: 'description',
      sorter: true,
    },
    {
      title: formatMessage({ id: 'certificate.task.id.label' }),
      dataIndex: 'approvedOnTaskId',
      sorter: true,
    },
    {
      title: formatMessage({ id: 'certificate.createdBy.label' }),
      dataIndex: 'createdBy',
      sorter: true,
    },
    {
      title: formatMessage({ id: 'certificate.ipfsaddress.label' }),
      dataIndex: 'ipfsAddress',
      sorter: true,
      render(val) {
        return <a href={val}>{val}</a>;
      },
    },
    {
      title: formatMessage({ id: 'certificate.company.id.label' }),
      dataIndex: 'cpid',
      sorter: true,
    },
    {
      title: formatMessage({ id: 'certificate.expiry.time.label' }),
      dataIndex: 'expiryTime',
      sorter: true,
      width: 160,
    },
    {
      title: formatMessage({ id: 'certificate.createdAt.label' }),
      dataIndex: 'createdAt',
      sorter: true,
      width: 160,
    },
    // {
    //   title: 'actions',
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
      type: 'certificates/getDocuments',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const tbSort = sorter.field ? { field: sorter.field, order: sorter.order } : {};
    const tbStatus = filtersArg.state ? filtersArg.state : [];
    this.setState({ status: tbStatus, sorter: tbSort });
  };

  gotoApproveForm = id => {
    router.push(`/certification/approve_certificate/${id}`);
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
    // const { dispatch } = this.props;
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
        createdAt: fieldsValue.createdAt ? fieldsValue.createdAt.format('YYYY-MM-DD') : 0,
        expiryTime: fieldsValue.expiryTime ? fieldsValue.expiryTime.format('YYYY-MM-DD') : 0,
      };
      const newValues = Object.keys(values).reduce(
        (result, key) => (values[key] ? { ...result, [key]: values[key] } : result),
        {}
      );
      this.setState({ formValues: newValues });
    });
  };

  handleRedirect = () => {
    router.push('/certification/create_certificate');
  };

  isFechable(doc) {
    const { formValues } = this.state;
    const terms = Object.keys(formValues);
    for (let i = 0; i < terms.length; i += 1) {
      const key = terms[i];
      if (!doc[key] || !String(doc[key]).includes(formValues[key])) return false;
    }
    return true;
  }

  fechData() {
    const {
      certificates: { documents },
    } = this.props;
    const { status } = this.state;
    const newDocs = documents
      .map((doc, index) => {
        return {
          ...doc,
          createdAt: moment(doc.createdAt).format('YYYY-MM-DD HH:mm:ss'),
          expiryTime: moment(doc.expiryTime).format('YYYY-MM-DD HH:mm:ss'),
          key: index,
        };
      })
      .filter(doc => {
        let isValide = this.isFechable(doc);
        if (status.length && !status.includes(doc.state)) isValide = false;
        return isValide;
      });

    return newDocs;
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
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="certificate.document.id.label" />}>
              {getFieldDecorator('documentId')(
                <Input placeholder={formatMessage({ id: 'certificate.document.id.validation' })} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="certificate.name.label" />}>
              {getFieldDecorator('name')(
                <Input
                  placeholder={formatMessage({ id: 'certificate.document.name.validation' })}
                />
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
            <FormItem label={<FormattedMessage id="certificate.document.id.label" />}>
              {getFieldDecorator('documentId')(
                <Input placeholder={formatMessage({ id: 'certificate.document.id.validation' })} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="certificate.name.label" />}>
              {getFieldDecorator('name')(
                <Input
                  placeholder={formatMessage({ id: 'certificate.document.name.validation' })}
                />
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
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="certificate.company.id.label" />}>
              {getFieldDecorator('cpid')(
                <Input placeholder={formatMessage({ id: 'certificate.company.id.validation' })} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="certificate.task.id.label" />}>
              {getFieldDecorator('approvedOnTaskId')(
                <Input placeholder={formatMessage({ id: 'certificate.task.id.validation' })} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="certificate.expired.label" />}>
              {getFieldDecorator('expiryTime')(
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'certificate.expired.validation' })}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="certificate.createdBy.label" />}>
              {getFieldDecorator('createdBy')(
                <Input placeholder={formatMessage({ id: 'certificate.createdBy.validation' })} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="certificate.createdAt.label" />}>
              {getFieldDecorator('createdAt')(
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'certificate.createdAt.validation' })}
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
    const { loading } = this.props;
    const { selectedRows } = this.state;
    let fetchData = this.fechData();
    if (fetchData.length) fetchData = this.sortData(fetchData);
    const data = { list: fetchData };
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">
          <FormattedMessage id="form.remove" />
        </Menu.Item>
        {/* <Menu.Item key="approval">Approve</Menu.Item> */}
      </Menu>
    );
    return (
      <PageHeaderWrapper title={<FormattedMessage id="certificate.list.certificate" />}>
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
export default CertificateDocumentList;
