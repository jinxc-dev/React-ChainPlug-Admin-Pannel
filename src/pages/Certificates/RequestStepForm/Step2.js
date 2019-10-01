import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Divider } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import styles from './style.less';

const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 18 },
  },
};

@connect(({ certificateForm }) => ({
  data: certificateForm.step,
}))
@Form.create()
class Step2 extends React.PureComponent {
  render() {
    const { form, data, dispatch } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onPrev = () => {
      router.push('/certification/step-form/info');
    };
    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'certificateForm/submitTaskInfo',
            payload: { ...values },
          });
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm}>
          {/* <Alert
          closable
          showIcon
          message="确认转账后，资金将直接打入对方账户，无法退回。"
          style={{ marginBottom: 24 }}
        /> */}
          <Form.Item
            {...formItemLayout}
            className={styles.stepFormText}
            label={<FormattedMessage id="certificate.certificate.type.label" />}
          >
            {getFieldDecorator('type', {
              initialValue: data.certificateType,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'certificate.certificate.type.validation' }),
                },
              ],
            })(<Input type="text" readOnly />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            className={styles.stepFormText}
            label={<FormattedMessage id="certificate.description.label" />}
          >
            {getFieldDecorator('description', {
              initialValue: data.description,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'certificate.description.validation' }),
                },
              ],
            })(<Input type="text" readOnly />)}
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.btn_section}>
          <Button type="primary" onClick={onValidateForm} style={{ marginRight: '8px' }}>
            {' '}
            Submit{' '}
          </Button>
          <Button onClick={onPrev}> Edit </Button>
        </div>
      </Fragment>
    );
  }
}

export default Step2;
