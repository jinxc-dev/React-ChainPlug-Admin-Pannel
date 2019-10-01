import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { List, Form, Input, DatePicker, Select, Button, Card, Row, Col, Divider } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
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

@connect(({ chains }) => ({
  chainData: chains.blockchain,
}))
@Form.create()
class BlockchainForm extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;

    dispatch({
      type: 'chains/getBlockchain',
      payload: { chainId: params.id },
    });
  }

  onPrev = () => {
    router.push('/blockchain/iotlist');
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
    //       type: 'certificateForm/updatechainData',
    //       payload: params,
    //     });
    //   }
    // });
  };

  render() {
    console.log(this.props);
    const { form, chainData } = this.props;
    const { getFieldDecorator } = form;

    return (
      <PageHeaderWrapper title={<FormattedMessage id="menu.blockchain.form" />}>
        <Card bordered={false}>
        {chainData['block_data'] && 
          <Form style={{ marginTop: 8 }}>
          <Row>
            <Col span={12} style={paddingStyle}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="chains.id.sens.label" />}
              >
                {getFieldDecorator('idSens', { initialValue: chainData['block_data'].idSens })(
                  <Input className={styles.disabled} disabled />
                )}
              </FormItem>
            </Col>
            <Col span={12} style={paddingStyle}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="chains.id.event.label" />}
              >
                <Input value={chainData['block_data'].idEVent} className={styles.disabled} disabled />
              </FormItem>
            </Col>
          </Row>

          <Row>
            {/* <Col span={12} style={paddingStyle}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="chains.severity.label" />}
              >
                {getFieldDecorator('severity', { initialValue: chainData.severity })(
                  <Select>
                    <Option value="Normal">Normal</Option>
                    <Option value="Critical">Critical</Option>
                  </Select>
                )}
              </FormItem>
            </Col> */}
            <Col span={12} style={paddingStyle}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="chains.criticality.label" />}
              >
                {getFieldDecorator('criticality', { initialValue: chainData['block_data'].criticality })(
                  <Input className={styles.disabled} disabled />
                )}
              </FormItem>
            </Col>
            {/* <Col span={12} style={paddingStyle}>
              <FormItem {...formItemLayout} label={<FormattedMessage id="chains.type.label" />}>
                {getFieldDecorator('type', { initialValue: chainData.type })(
                  <Select>
                    <Option value="Temp">Temp</Option>
                    <Option value="Mov">Mov</Option>
                    <Option value="Press">Press</Option>
                  </Select>
                )}
              </FormItem>
            </Col> */}
            <Col span={12} style={paddingStyle}>
              <FormItem {...formItemLayout} label={<FormattedMessage id="chains.type.label" />}>
                {getFieldDecorator('type', { initialValue: chainData['block_data'].type })(
                  <Input className={styles.disabled} disabled />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={12} style={paddingStyle}>
              <FormItem {...formItemLayout} label={<FormattedMessage id="chains.buffer.label" />}>
                <Input value={chainData['block_data'].buffer} className={styles.disabled} disabled/>
              </FormItem>
            </Col>
            <Col span={12} style={paddingStyle}>
              <FormItem {...formItemLayout} label={<FormattedMessage id="chains.id.tx.label" />}>
                <Input value={chainData['block_data']['tx_id']} className={styles.disabled} disabled/>
              </FormItem>
            </Col>
            {/* <Col span={12} style={paddingStyle}>
              <FormItem {...formItemLayout} label={<FormattedMessage id="chains.date.label" />}>
                <DatePicker
                  style={{ width: '100%' }}
                  // value={chainData.date}
                  defaultValue={moment(chainData.date)}
                  format="YYYY-MM-DD"
                />
              </FormItem>
            </Col> */}
          </Row>
            
          <Row>
            <Col span={24} style={paddingStyle}>
              <FormItem
                {...desciptionLayout}
                label={<FormattedMessage id="chains.description.label" />}
              >
                {getFieldDecorator('description', {
                  initialValue: chainData.description,
                })(<TextArea rows={3} />)}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={24} style={paddingStyle}>
              <List
                size="small"
                header={<div style={{ fontWeight: '500' }}>Payload</div>}
                bordered
                dataSource={chainData['block_data'].payload}
                renderItem={item => <List.Item>{item}</List.Item>}
              />
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
        }
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BlockchainForm;
