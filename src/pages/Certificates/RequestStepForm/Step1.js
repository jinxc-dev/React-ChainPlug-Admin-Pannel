import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import styles from './style.less';

const { Option } = Select;
const { TextArea } = Input;

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
class Step1 extends React.PureComponent {
  render() {
    const { form, dispatch, data } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'certificateForm/saveStepFormData',
            payload: values,
          });
          router.push('/certification/step-form/confirm');
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item
            {...formItemLayout}
            label={<FormattedMessage id="certificate.certificate.type.label" />}
          >
            {getFieldDecorator('certificateType', {
              initialValue: data.certificateType,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'certificate.certificate.type.validation' }),
                },
              ],
            })(
              <Select>
                <Option value="ISO 9000">ISO 9000</Option>
                <Option value="ISO 5000">ISO 5000</Option>
                <Option value="ISO xxxx">ISO xxxx</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
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
            })(
              <TextArea
                autosize={{ minRows: 3, maxRows: 3 }}
                placeholder={formatMessage({ id: 'certificate.description.validation' })}
              />
            )}
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.btn_section}>
          <Button type="primary" onClick={onValidateForm}>
            {' '}
            Submit{' '}
          </Button>
        </div>
      </Fragment>
    );
  }
}

export default Step1;
