import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Form, Input, DatePicker, Select, Button, Card, Row, Col, Divider } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import moment from 'moment';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    md: { span: 24 },
    lg: { span: 8 },
  },
  wrapperCol: {
    md: { span: 24 },
    lg: { span: 16 },
  },
};
const desciptionLayout = {
  labelCol: {
    md: { span: 24 },
    lg: { span: 4 },
  },
  wrapperCol: {
    md: { span: 24 },
    lg: { span: 20 },
  },
};
const paddingStyle = {
  padding: '0px 8px',
};
const statusStyles = {
  Normal: { backgroundColor: 'limegreen' },
  Critical: { backgroundColor: 'red' },
};

@connect(({ assets, loading }) => ({
  sensorData: assets.BlockchainAsset,
  loading: loading.models.assets,
}))
@Form.create()
class BlockchainForm extends Component {
  state = {
    selectedRows: [],
    filters: [],
    sorter: {},
  };

  columns = [
    {
      title: formatMessage({ id: 'chains.severity.label' }),
      dataIndex: 'severity',
      width: 120,
      fixed: true,
      filters: [
        {
          text: formatMessage({ id: 'chains.severity.Normal' }),
          value: 'Normal',
        },
        {
          text: formatMessage({ id: 'chains.severity.Critical' }),
          value: 'Critical',
        },
      ],
      render(val) {
        return (
          <div style={{ ...statusStyles[val], ...{ borderRadius: '3px', textAlign: 'center' } }}>
            {formatMessage({ id: `chains.severity.${val}` })}
          </div>
        );
      },
    },
    {
      title: formatMessage({ id: 'chains.id.sens.label' }),
      dataIndex: 'idSens',
      fixed: 'left',
      sorter: true,
      width: 120,
      render: text => <a onClick={() => this.gotoDetailForm(text)}>{text}</a>,
    },
    {
      title: formatMessage({ id: 'chains.type.label' }),
      dataIndex: 'type',
      sorter: true,
    },
    {
      title: formatMessage({ id: 'chains.id.event.label' }),
      dataIndex: 'idEvent',
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
    {
      title: formatMessage({ id: 'chains.date.label' }),
      dataIndex: 'date',
      sorter: true,
      width: 160,
    },
  ];

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;

    dispatch({
      type: 'assets/getBlockchainAsset',
      payload: { chainId: params.id },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const tbSort = sorter.field ? { field: sorter.field, order: sorter.order } : {};
    const tbfilters = filtersArg.severity ? filtersArg.severity : [];
    this.setState({ filters: tbfilters, sorter: tbSort });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  onPrev = () => {
    router.push('/blockchain/asset_management');
  };

  onValidateForm = e => {
    e.preventDefault();
    // const { form, dispatch } = this.props;
    // const { validateFields } = form;
    // validateFields((err, values) => {
    //   if (!err) {
    //     const params = Object.keys(values).reduce(
    //       (result, key) => (values[key] ? { ...result, [key]: values[key] } : result),
    //       {}
    //     );
    //     dispatch({
    //       type: 'certificateForm/updatesensorData',
    //       payload: params,
    //     });
    //   }
    // });
  };

  fetchData() {
    const {
      sensorData: { events },
    } = this.props;
    const { filters } = this.state;
    if (!events) return [];
    const newEvents = events
      .map((event, index) => {
        return {
          ...event,
          date: moment(event.date).format('YYYY-MM-DD'),
          key: index,
        };
      })
      .filter(event => {
        if (filters.length && !filters.includes(event.severity)) return false;
        return true;
      });

    return newEvents;
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

  render() {
    const { form, sensorData, loading } = this.props;
    const { getFieldDecorator } = form;
    const { selectedRows } = this.state;
    let fetchedData = this.fetchData();
    if (fetchedData.length) fetchedData = this.sortData(fetchedData);
    const data = { list: fetchedData };
    // console.log(this.props, 'tableData')

    return (
      <PageHeaderWrapper title={<FormattedMessage id="menu.blockchain.AssetForm" />}>
        <Card bordered={false}>
          <p className={styles.title}>{<FormattedMessage id="chains.sensor.label" />}</p>
          <Form style={{ marginTop: 8 }}>
            <Row>
              <Col span={12} style={paddingStyle}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="chains.id.sens.label" />}
                >
                  {getFieldDecorator('id', { initialValue: sensorData.id })(
                    <Input className={styles.disabled} disabled />
                  )}
                </FormItem>
              </Col>
              <Col span={12} style={paddingStyle}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="certificate.name.label" />}
                >
                  <Input value={sensorData.name} className={styles.disabled} disabled />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12} style={paddingStyle}>
                <FormItem {...formItemLayout} label={<FormattedMessage id="chains.type.label" />}>
                  {getFieldDecorator('type', { initialValue: sensorData.type })(
                    <Select>
                      <Option value="Temp">Temp</Option>
                      <Option value="Mov">Mov</Option>
                      <Option value="Press">Press</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12} style={paddingStyle}>
                <FormItem {...formItemLayout} label={<FormattedMessage id="chains.date.label" />}>
                  <DatePicker
                    style={{ width: '100%' }}
                    // value={sensorData.date}
                    defaultValue={moment(sensorData.date)}
                    format="YYYY-MM-DD"
                  />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12} style={paddingStyle}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="chains.latitude.label" />}
                >
                  <Input value={sensorData.latitude} />
                </FormItem>
              </Col>
              <Col span={12} style={paddingStyle}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="chains.longitude.label" />}
                >
                  <Input value={sensorData.longitude} />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={24} style={paddingStyle}>
                <FormItem
                  {...desciptionLayout}
                  label={<FormattedMessage id="certificate.description.label" />}
                >
                  {getFieldDecorator('description', {
                    initialValue: sensorData.description,
                  })(<TextArea rows={3} />)}
                </FormItem>
              </Col>
            </Row>

            <Divider style={{ margin: '40px 0 24px' }} />
            <div className={styles.btn_section} style={{ marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: '8px' }}
                onClick={this.onValidateForm}
              >
                <FormattedMessage id="form.submit" />
              </Button>
              <Button onClick={this.onPrev}> Cancel </Button>
            </div>
          </Form>
        </Card>
        <Card bordered={false} style={{ marginTop: '20px' }}>
          <p className={styles.title}>{<FormattedMessage id="chains.list.events.label" />}</p>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            scroll={{ x: 1500 }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BlockchainForm;
