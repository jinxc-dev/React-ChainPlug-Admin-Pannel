import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Form, Input, DatePicker, Button, Card, Divider, Select } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

@connect(({ loading }) => ({
  submitting: loading.effects['certificateForm/submitDocInfo'],
}))
@Form.create()
class CreateCertificateForm extends PureComponent {
  state = {
    docFile: null,
    addressPrefix: 'http://',
  };

  onValidateForm = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { validateFields } = form;
    const { addressPrefix } = this.state;

    validateFields((err, fields) => {
      if (!err) {
        // let formData = new FormData();
        const values = {
          ...fields,
          expiryTime: fields.expiryTime.format('YYYY-MM-DD'),
          ipfsAddress: addressPrefix + fields.ipfsAddress,
        };
        dispatch({
          type: 'certificateForm/submitDocInfo',
          payload: values,
        });
      }
    });
  };

  handleSelectFile = e => {
    const { files } = e.target;
    if (!files.length) return;

    this.setState({ docFile: files[0] });
  };

  handleAddressPrefix = prefix => {
    this.setState({ addressPrefix: prefix });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { docFile, addressPrefix } = this.state;

    const selectBefore = (
      <Select
        defaultValue={addressPrefix}
        style={{ width: 90 }}
        onChange={this.handleAddressPrefix}
      >
        <Option value="http://">http://</Option>
        <Option value="https://">https://</Option>
      </Select>
    );

    return (
      <PageHeaderWrapper title={<FormattedMessage id="admin.new.consortium" />}>
        <Card bordered={false}>
          <Form style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="certificate.name.label" />}>
              {getFieldDecorator('name', {
                rules: [
                  { required: true, message: formatMessage({ id: 'certificate.name.validation' }) },
                ],
              })(<Input placeholder={formatMessage({ id: 'certificate.name.validation' })} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="certificate.description.label" />}
            >
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'certificate.description.validation' }),
                  },
                ],
              })(<TextArea style={{ minHeight: 32 }} rows={4} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="certificate.expired.label" />}
            >
              {getFieldDecorator('expiryTime', {
                rules: [
                  { required: true, message: formatMessage({ id: 'certificate.date.validation' }) },
                ],
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'certificate.date.validation' })}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="certificate.ipfsaddress.label" />}
            >
              {getFieldDecorator('ipfsAddress')(
                <Input
                  addonBefore={selectBefore}
                  placeholder={formatMessage({ id: 'certificate.ipfsaddress.validation' })}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="certificate.document.label" />}
            >
              {getFieldDecorator('document')(
                <div>
                  <input
                    type="file"
                    ref={ele => {
                      this.docFileInput = ele;
                      return this.docFileInput;
                    }}
                    onChange={this.handleSelectFile}
                    style={{ position: 'fixed', top: '-100px' }}
                  />
                  <Button
                    icon="upload"
                    onClick={() => {
                      this.docFileInput.click();
                    }}
                  >
                    {formatMessage({ id: 'certificate.document.selection' })}
                  </Button>
                </div>
              )}
              {docFile && <p>{docFile.name}</p>}
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
            </div>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CreateCertificateForm;
