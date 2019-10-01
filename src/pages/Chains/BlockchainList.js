import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  InputNumber,
  Icon,
  Button,
  Dropdown,
  Menu,
  DatePicker,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PageLoading from '@/components/PageLoading';
import styles from '../List/TableList.less';
import ReviewRow from './ReviewRow';

// const ReviewRow = React.lazy(() => import('./ReviewRow'));
const FormItem = Form.Item;
// const { TextArea } = Input;

const statusStyles = {
  Normal: { backgroundColor: 'limegreen' },
  Critical: { backgroundColor: 'red' },
};

/* eslint react/no-multi-comp:0 */
@connect(({ chains, loading }) => ({
  dataList: chains.IoTInBlockchains,
  loading: loading.models.chains,
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

  reviews = [
    {
      title: 'chains.title.1.label',
      mainValue: 0,
      subTitle: 'chains.subtitle.1.label',
      subValue: 0,
      icon: '/icons/event.png',
    },
    {
      title: 'chains.title.2.label',
      mainValue: 0,
      subTitle: 'chains.subtitle.2.label',
      subValue: 0,
      icon: '/icons/device.png',
    },
    {
      title: 'chains.title.3.label',
      mainValue: 0,
      subTitle: 'chains.subtitle.3.label',
      subValue: 0,
      icon: '/icons/check.png',
    },
  ];

  columns = [
    // {
    //   title: formatMessage({ id: 'chains.severity.label' }),
    //   dataIndex: 'severity',
    //   width: 120,
    //   fixed: true,
    //   filters: [
    //     {
    //       text: formatMessage({ id: 'chains.severity.Normal' }),
    //       value: 'Normal',
    //     },
    //     {
    //       text: formatMessage({ id: 'chains.severity.Critical' }),
    //       value: 'Critical',
    //     },
    //   ],
    //   render(val) {
    //     return (
    //       <div style={{ ...statusStyles[val], ...{ borderRadius: '3px', textAlign: 'center' } }}>
    //         {formatMessage({ id: `chains.severity.${val}` })}
    //       </div>
    //     );
    //   },
    // },
    {
      title: formatMessage({ id: 'chains.number.label' }),
      dataIndex: 'key',
      fixed: 'left',
      sorter: true,
      width: 150,
      render: text => <a onClick={() => this.gotoDetailForm(text)}>{text}</a>,
    },
    {
      title: formatMessage({ id: 'chains.id.sens.label' }),
      dataIndex: 'idSens',
      fixed: 'left',
      sorter: true,
      width: 120,
      // render: text => <a onClick={() => this.gotoDetailForm(text)}>{text}</a>,
    },
    {
      title: formatMessage({ id: 'chains.criticality.label' }),
      dataIndex: 'criticality',
      sorter: true,
    },
    {
      title: formatMessage({ id: 'chains.type.label' }),
      dataIndex: 'type',
      sorter: true,
    },
    {
      title: formatMessage({ id: 'chains.id.event.label' }),
      dataIndex: 'idEVent',
      sorter: true,
    },
    {
      title: formatMessage({ id: 'chains.id.tx.label' }),
      dataIndex: 'tx_id',
      sorter: true,
    },
    // {
    //   title: formatMessage({ id: 'certificate.description.label' }),
    //   dataIndex: 'description',
    //   width: 320,
    //   sorter: true,
    // },
    {
      title: formatMessage({ id: 'chains.buffer.label' }),
      dataIndex: 'buffer',
      sorter: true,
    },
    // {
    //   title: formatMessage({ id: 'chains.date.label' }),
    //   dataIndex: 'date',
    //   sorter: true,
    //   width: 160,
    // },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chains/getBlockchains',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const tbSort = sorter.field ? { field: sorter.field, order: sorter.order } : {};
    const tbfilters = filtersArg.severity ? filtersArg.severity : [];
    this.setState({ filters: tbfilters, sorter: tbSort });
  };

  gotoDetailForm = id => {
    router.push(`/blockchain/blockchain_form/${id}`);
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
      .map(chain => {
        return {
          ...chain['block_data'],
          // Date: moment(chain.Date).format('YYYY-MM-DD'),
          previous_hash: chain['previous_hash'],
          current_hash: chain['current_hash'],
          key: chain.blockNumber,
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
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="chains.id.sens.label" />}>
              {getFieldDecorator('idSens')(
                <Input placeholder={formatMessage({ id: 'chains.id.sens.validation' })} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="chains.type.label" />}>
              {getFieldDecorator('type')(
                <Input placeholder={formatMessage({ id: 'chains.type.validation' })} />
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
            <FormItem label={<FormattedMessage id="chains.id.sens.label" />}>
              {getFieldDecorator('idSens')(
                <Input placeholder={formatMessage({ id: 'chains.id.sens.validation' })} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="chains.type.label" />}>
              {getFieldDecorator('type')(
                <Input placeholder={formatMessage({ id: 'chains.type.validation' })} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="chains.id.event.label" />}>
              {getFieldDecorator('idEvent')(
                <Input placeholder={formatMessage({ id: 'chains.id.event.validation' })} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage id="chains.buffer.label" />}>
              {getFieldDecorator('buffer')(
                <InputNumber
                  min={0}
                  max={999}
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'chains.buffer.validation' })}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
    console.log(this.props);
    const { loading } = this.props;
    const { selectedRows } = this.state;
    let fetchedData = this.fetchData();
    if (fetchedData.length) fetchedData = this.sortData(fetchedData);
    const data = { list: fetchedData };
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">
          <FormattedMessage id="form.remove" />
        </Menu.Item>
        {/* <Menu.Item key="approval">Approve</Menu.Item> */}
      </Menu>
    );
    const visitData = this.reviews;
    return (
      <PageHeaderWrapper title={<FormattedMessage id="menu.blockchain.Blockchain" />}>
        <Suspense fallback={<PageLoading />}>
          <ReviewRow loading={loading} visitData={visitData} />
        </Suspense>
        <Suspense fallback={null}>
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
        </Suspense>
      </PageHeaderWrapper>
    );
  }
}
export default CertificateDocumentList;
