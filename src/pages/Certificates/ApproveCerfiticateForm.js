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
  // Comment,
  // Avatar,
  // List,
  // Tooltip,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import styles from './style.less';

const FormItem = Form.Item;
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

const paddingStyle = {
  padding: '0px 8px',
};

@connect(({ certificateForm }) => ({
  docInfo: certificateForm.document,
  // submitting: loading.effects['form/updateDocInfo'],
}))
@Form.create()
class ApproveCerfiticateForm extends PureComponent {
  // state = {
  //   newComment: ''
  // };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;

    dispatch({
      type: 'certificateForm/getDocInfo',
      payload: { documentId: params.id },
    });
  }

  onPrev = () => {
    router.push('/certification/documents');
  };

  onValidateForm = e => {
    e.preventDefault();
    const { docInfo, form, dispatch } = this.props;
    const { validateFields } = form;
    validateFields((err, fields) => {
      if (!err) {
        const values = {
          ...fields,
          expiryTime: fields.expiryTime.format('YYYY-MM-DD'),
          documentId: docInfo.documentId,
        };
        dispatch({
          type: 'certificateForm/updateDocInfo',
          payload: values,
        });
      }
    });
  };

  render() {
    console.log(this.props);
    const { form, docInfo } = this.props;
    const { getFieldDecorator } = form;

    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="certificate.certificate.label" />}
        // content={<FormattedMessage id="app.forms.basic.description" />}
      >
        <Card bordered={false}>
          <Form hideRequiredMark style={{ marginTop: 8 }}>
            <Row>
              <Col span={12} style={paddingStyle}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="certificate.document.id.label" />}
                >
                  <Input value={docInfo.documentId} className={styles.disabled} disabled />
                </FormItem>
              </Col>
              <Col span={12} style={paddingStyle}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="certificate.name.label" />}
                >
                  {/* {getFieldDecorator('name', {
                    initialValue: docInfo.name,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'validation.name.required' }),
                      },
                    ],
                  })(<Input placeholder='' />)} */}
                  <Input value={docInfo.name} className={styles.disabled} disabled />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12} style={paddingStyle}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="certificate.company.id.label" />}
                >
                  <Input value={docInfo.cpid} className={styles.disabled} disabled />
                </FormItem>
              </Col>
              <Col span={12} style={paddingStyle}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="certificate.createdAt.label" />}
                >
                  <Input
                    value={moment(docInfo.createdAt).format('YYYY-MM-DD')}
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
                  label={<FormattedMessage id="certificate.createdBy.label" />}
                >
                  <Input value={docInfo.createdBy} className={styles.disabled} disabled />
                </FormItem>
              </Col>
              <Col span={12} style={paddingStyle}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="certificate.ipfsaddress.label" />}
                >
                  <Input value={docInfo.ipfsAddress} className={styles.disabled} disabled />
                  {/* <Input addonBefore={selectBefore} value={docInfo.ipfsAddress} disabled /> */}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12} style={paddingStyle}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="certificate.expired.label" />}
                >
                  {getFieldDecorator('expiryTime', {
                    initialValue: moment(docInfo.expiryTime),
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'certificate.date.validation' }),
                      },
                    ],
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder={formatMessage({ id: 'certificate.date.validation' })}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <FormItem
              {...commentLayout}
              style={paddingStyle}
              label={<FormattedMessage id="certificate.description.label" />}
            >
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'certificate.description.validation' }),
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder={formatMessage({ id: 'certificate.description.validation' })}
                  rows={4}
                />
              )}
            </FormItem>

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
              <Button onClick={this.onPrev}>
                {' '}
                <FormattedMessage id="form.cancel" />{' '}
              </Button>
            </div>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ApproveCerfiticateForm;
