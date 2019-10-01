import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Icon, Button, Dropdown, Menu, DatePicker } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PageLoading from '@/components/PageLoading';
import GoogleMap from '@/components/GoogleMap';
import styles from '../List/TableList.less';

// const ReviewRow = React.lazy(() => import('./ReviewRow'));
const FormItem = Form.Item;
// const { TextArea } = Input;

// const statusStyles = {
//   draft: { backgroundColor: '#e8e8e8' },
//   approved: { backgroundColor: 'green', color: 'white' },
//   finalized: { backgroundColor: 'blue', color: 'white' },
//   cancelled: { backgroundColor: 'red', color: 'white' },
// };

/* eslint react/no-multi-comp:0 */
@connect(({ assets, loading }) => ({
  dataList: assets.BlockchainAssets,
  loading: loading.models.assets,
}))
@Form.create()
class CertificateDocumentList extends Component {
  state = {
    expandForm: false,
    selectedRows: [],
    filters: [],
    sorter: {},
    formValues: {},
  };

  columns = [
    {
      title: 'Sens Id',
      dataIndex: 'id',
      fixed: 'left',
      width: 100,
      render: text => <a onClick={() => this.gotoSensorDetail(text)}>{text}</a>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      fixed: 'left',
      width: 100,
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: 180,
    },
    {
      title: 'Latitude',
      dataIndex: 'latitude',
    },
    {
      title: 'Longitude',
      dataIndex: 'longitude',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: true,
      width: 160,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'assets/getBlockchainAssets',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const tbSort = sorter.field ? { field: sorter.field, order: sorter.order } : {};
    const tbStatus = filtersArg.state ? filtersArg.state : [];
    this.setState({ filters: tbStatus, sorter: tbSort });
  };

  gotoSensorDetail = id => {
    router.push(`/blockchain/asset_form/${id}`);
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
    // router.push('/certification/create_certificate');
  };

  isFechable(chain) {
    const { formValues } = this.state;
    const terms = Object.keys(formValues);
    for (let i = 0; i < terms.length; i += 1) {
      const key = terms[i];
      if (!chain[key] || !String(chain[key]).includes(formValues[key])) return false;
    }
    return true;
  }

  fetchData() {
    const { dataList } = this.props;
    const { filters } = this.state;
    const newChains = dataList
      .map((chain, index) => {
        return {
          ...chain,
          Date: moment(chain.Date).format('YYYY-MM-DD'),
          key: index,
        };
      })
      .filter(chain => {
        let isValide = this.isFechable(chain);
        if (filters.length && !filters.includes(chain.severity)) isValide = false;
        return isValide;
      });

    return newChains;
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
          <Col md={12} sm={24}>
            <FormItem label={<FormattedMessage id="chains.id.sens.label" />}>
              {getFieldDecorator('id')(
                <Input placeholder={formatMessage({ id: 'chains.id.sens.validation' })} />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label={<FormattedMessage id="certificate.name.label" />}>
              {getFieldDecorator('name')(
                <Input placeholder={formatMessage({ id: 'certificate.name.validation' })} />
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
              <FormattedMessage id="form.more" /> <Icon type="down" />{' '}
            </a>
          </div>
        </div>
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
          <Col md={12} sm={24}>
            <FormItem label={<FormattedMessage id="chains.id.sens.label" />}>
              {getFieldDecorator('id')(
                <Input placeholder={formatMessage({ id: 'chains.id.sens.validation' })} />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label={<FormattedMessage id="certificate.name.label" />}>
              {getFieldDecorator('type')(
                <Input placeholder={formatMessage({ id: 'certificate.name.validation' })} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label={<FormattedMessage id="chains.type.label" />}>
              {getFieldDecorator('type')(
                <Input placeholder={formatMessage({ id: 'chains.type.validation' })} />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label={<FormattedMessage id="chains.date.label" />}>
              {getFieldDecorator('date')(
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'chains.date.validation' })}
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
    let fetchedData = this.fetchData();
    if (fetchedData.length) fetchedData = this.sortData(fetchedData);
    const data = { list: fetchedData };
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">Remove</Menu.Item>
        {/* <Menu.Item key="approval">Approve</Menu.Item> */}
      </Menu>
    );
    return (
      <PageHeaderWrapper title={<FormattedMessage id="menu.blockchain.AssetManagement" />}>
        <Row>
          <Col xl={12} lg={24} style={{ padding: '0px 4px', height: '100%' }}>
            <Suspense fallback={<PageLoading />}>
              <div style={{ height: '560px', marginBottom: '30px' }}>
                <GoogleMap />
              </div>
            </Suspense>
          </Col>
          <Col xl={12} lg={24} style={{ padding: '0px 4px' }}>
            <Suspense fallback={null}>
              <Card bordered={false}>
                <div className={styles.tableList}>
                  <div className={styles.tableListForm}>{this.renderForm()}</div>
                  <div className={styles.tableListOperator}>
                    <Button icon="plus" type="primary" onClick={this.handleRedirect}>
                      <FormattedMessage id="form.new" />
                    </Button>
                    {selectedRows.length > 0 && (
                      <span>
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
                    scroll={{ x: 800 }}
                  />
                </div>
              </Card>
            </Suspense>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}
export default CertificateDocumentList;
