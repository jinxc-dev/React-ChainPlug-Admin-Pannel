import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Form, Input, Button, Popover, Progress } from 'antd';
import styles from './BaseView.less';

const FormItem = Form.Item;
// const { Option } = Select;
// const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="validation.password.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="validation.password.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="validation.password.strength.short" />
    </div>
  ),
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ loading }) => ({
  submitting: loading.effects['login/pwdchange'],
}))
@Form.create()
class ResetView extends Component {
  state = {
    // count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    // prefix: '86',
  };

  // componentDidUpdate() {
  //   const { form, register } = this.props;
  //   const account = form.getFieldValue('mail');
  //   if (register.status === 'ok') {
  //     router.push({
  //       pathname: '/user/register-result',
  //       state: {
  //         account,
  //       },
  //     });
  //   }
  // }

  // componentWillUnmount() {
  //   clearInterval(this.interval);
  // }

  // onGetCaptcha = () => {
  //   let count = 59;
  //   // this.setState({ count });
  //   this.interval = setInterval(() => {
  //     count -= 1;
  //     // this.setState({ count });
  //     if (count === 0) {
  //       clearInterval(this.interval);
  //     }
  //   }, 1000);
  // };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('newPassword');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        const formValues = { password: values.password, newPassword: values.newPassword };

        dispatch({
          type: 'login/pwdchange',
          payload: { ...formValues },
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({ id: 'validation.password.required' }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  // changePrefix = value => {
  //   this.setState({
  //     prefix: value,
  //   });
  // };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('newPassword');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { help, visible } = this.state;
    return (
      <div className={styles.baseView}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit}>
            <FormItem label="Current Password">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.password.required' }),
                  },
                ],
              })(
                <Input.Password placeholder={formatMessage({ id: 'form.password.placeholder' })} />
              )}
            </FormItem>
            <FormItem help={help} label="New Password">
              <Popover
                getPopupContainer={node => node.parentNode}
                content={
                  <div style={{ padding: '4px 0' }}>
                    {passwordStatusMap[this.getPasswordStatus()]}
                    {this.renderPasswordProgress()}
                    <div style={{ marginTop: 10 }}>
                      <FormattedMessage id="validation.password.strength.msg" />
                    </div>
                  </div>
                }
                overlayStyle={{ width: 240 }}
                placement="right"
                visible={visible}
              >
                {getFieldDecorator('newPassword', {
                  rules: [
                    {
                      required: true,
                      validator: this.checkPassword,
                    },
                  ],
                })(
                  <Input.Password
                    placeholder={formatMessage({ id: 'form.password.placeholder' })}
                  />
                )}
              </Popover>
            </FormItem>
            <FormItem label="Confirm Password">
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.confirm-password.required' }),
                  },
                  {
                    validator: this.checkConfirm,
                  },
                ],
              })(
                <Input
                  type="password"
                  placeholder={formatMessage({ id: 'form.confirm-password.placeholder' })}
                />
              )}
            </FormItem>
            {/* <FormItem>
              <InputGroup compact>
                <Select
                  size="large"
                  value={prefix}
                  onChange={this.changePrefix}
                  style={{ width: '20%' }}
                >
                  <Option value="86">+86</Option>
                  <Option value="87">+87</Option>
                </Select>
                {getFieldDecorator('mobile', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.phone-number.required' }),
                    },
                    {
                      pattern: /^\d{11}$/,
                      message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
                    },
                  ],
                })(
                  <Input
                    size="large"
                    style={{ width: '80%' }}
                    placeholder={formatMessage({ id: 'form.phone-number.placeholder' })}
                  />
                )}
              </InputGroup>
            </FormItem>
            <FormItem>
              <Row gutter={8}>
                <Col span={16}>
                  {getFieldDecorator('captcha', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'validation.verification-code.required' }),
                      },
                    ],
                  })(
                    <Input
                      size="large"
                      placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
                    />
                  )}
                </Col>
                <Col span={8}>
                  <Button
                    size="large"
                    disabled={count}
                    className={styles.getCaptcha}
                    onClick={this.onGetCaptcha}
                  >
                    {count
                      ? `${count} s`
                      : formatMessage({ id: 'app.register.get-verification-code' })}
                  </Button>
                </Col>
              </Row>
            </FormItem> */}
            <FormItem>
              <Button
                size="large"
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                <FormattedMessage id="app.setting.reset.password.label" />
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default ResetView;
