import React, { PureComponent } from 'react';
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
  chainData: chains.coldchain,
}))
@Form.create()
class ColdchainForm extends PureComponent {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;

    dispatch({
      type: 'chains/getColdchain',
      payload: { chainId: params.id },
    });
  }

  onPrev = () => {
    router.push('/coldchain/coldchainlist');
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
    //       type: 'chains/updateColdchain',
    //       payload: params,
    //     });
    //   }
    // });
  };

  render() {
    const { form, chainData } = this.props;
    const { getFieldDecorator } = form;

    return (
      <PageHeaderWrapper title={<FormattedMessage id="menu.coldchain.form" />}>
        <Card bordered={false}>
          <Form style={{ marginTop: 8 }}>
            <Row>
              <Col span={12} style={paddingStyle}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="chains.id.sens.label" />}
                >
                  {getFieldDecorator('idSens', { initialValue: chainData.idSens })(
                    <Input className={styles.disabled} disabled />
                  )}
                </FormItem>
              </Col>
              <Col span={12} style={paddingStyle}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="chains.id.event.label" />}
                >
                  <Input value={chainData.idEvent} className={styles.disabled} disabled />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12} style={paddingStyle}>
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
              </Col>
              <Col span={12} style={paddingStyle}>
                <FormItem {...formItemLayout} label={<FormattedMessage id="chains.type.label" />}>
                  {getFieldDecorator('type', { initialValue: chainData.type })(
                    <Select>
                      <Option value="Temp">Temp</Option>
                      <Option value="Mov">Mov</Option>
                      <Option value="Press">Press</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12} style={paddingStyle}>
                <FormItem {...formItemLayout} label={<FormattedMessage id="chains.buffer.label" />}>
                  <Input value={chainData.buffer} />
                </FormItem>
              </Col>
              <Col span={12} style={paddingStyle}>
                <FormItem {...formItemLayout} label={<FormattedMessage id="chains.date.label" />}>
                  <DatePicker
                    style={{ width: '100%' }}
                    // value={chainData.date}
                    defaultValue={moment(chainData.date)}
                    format="YYYY-MM-DD"
                  />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={24} style={paddingStyle}>
                <FormItem
                  {...desciptionLayout}
                  label={<FormattedMessage id="form.description.label" />}
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
                  dataSource={chainData.payload}
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
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ColdchainForm;
