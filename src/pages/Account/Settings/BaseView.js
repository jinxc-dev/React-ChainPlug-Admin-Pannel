import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Form, Input, Button } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
// import GeographicView from './GeographicView';
// import PhoneView from './PhoneView';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;

/* const AvatarView = ({ avatar }) => (
  <Fragment>
    <div className={styles.avatar_title}>
      <FormattedMessage id="app.settings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload fileList={[]}>
      <div className={styles.button_view}>
        <Button icon="upload">
          <FormattedMessage id="app.settings.basic.change-avatar" defaultMessage="Change avatar" />
        </Button>
      </div>
    </Upload>
  </Fragment>
); */

/* const validatorGeographic = (rule, value, callback) => {
  const { province, city } = value;
  if (!province.key) {
    callback('Please input your province!');
  }
  if (!city.key) {
    callback('Please input your city!');
  }
  callback();
};

const validatorPhone = (rule, value, callback) => {
  const values = value ? value.split('-') : [];
  if (!values[0]) {
    callback('Please input your area code!');
  }
  if (!values[1]) {
    callback('Please input your phone number!');
  }
  callback();
}; */

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class BaseView extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetch',
    });
  }

  // setBaseInfo = () => {
  //   const { currentUser, form } = this.props;
  //   Object.keys(form.getFieldsValue()).forEach(key => {
  //     const obj = {};
  //     obj[key] = currentUser[key] || null;
  //     form.setFieldsValue(obj);
  //   });

  //   if (currentUser.companyId) {
  //     this.setState({ hasCompany: true });
  //   }
  // };

  // getAvatarURL() {
  //   const { currentUser } = this.props;
  //   return currentUser.avatar
  //     ? currentUser.avatar
  //     : 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
  // }

  handleSubmit = e => {
    const { dispatch, form, currentUser } = this.props;

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // delete values.email; 
        const params = Object.keys(values).reduce(
          (result, key) => (values[key] != currentUser[key] ? { ...result, [key]: values[key] } : result),
          {}
        );
        dispatch({
          type: 'user/update',
          payload: params,
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      currentUser,
    } = this.props;
    return (
      <div className={styles.baseView}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit}>
            <FormItem label={formatMessage({ id: 'app.settings.basic.email' })}>
              <Input value={currentUser.email} className={styles.disabled} disabled />
              {/* {getFieldDecorator('email', {
                initialValue: currentUser.email,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.email-message' }, {}),
                  },
                ],
              })(<Input className={styles.disabled} disabled />)} */}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.firstname' })}>
              {getFieldDecorator('firstName', {
                initialValue: currentUser.firstName,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.firstname-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.lastname' })}>
              {getFieldDecorator('lastName', {
                initialValue: currentUser.lastName,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.lastname-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            {currentUser.companyId ? (
              <FormItem label={formatMessage({ id: 'certificate.company.id.label' })}>
                <Input value={currentUser.companyId} disabled className={styles.disabled} />
              </FormItem>
            ) : (
              <FormItem label={formatMessage({ id: 'certificate.company.id.label' })}>
                {getFieldDecorator('companyId', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'certificate.company.id.validation' }, {}),
                    },
                  ],
                })(<Input />)}
              </FormItem>
            )}
            {/* <FormItem label={formatMessage({ id: 'app.settings.basic.country' })}>
              {getFieldDecorator('country', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.country-message' }, {}),
                  },
                ],
              })(
                <Select style={{ maxWidth: 220 }}>
                  <Option value="China">中国</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.geographic' })}>
              {getFieldDecorator('geographic', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.geographic-message' }, {}),
                  },
                  {
                    validator: validatorGeographic,
                  },
                ],
              })(<GeographicView />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.address' })}>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.address-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem> */}

            {/* <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}>
              {getFieldDecorator('officePhone', {
                rules: [
                  {
                    message: formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
                  },
                  // { validator: validatorPhone },
                ],
              })(<PhoneView />)}
            </FormItem> */}
            <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}>
              {getFieldDecorator('officePhone', {
                initialValue: currentUser.officePhone,
                rules: [
                  {
                    required: false,
                    message: formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
                  },
                  // { validator: validatorPhone },
                ],
              })(<Input />)}
            </FormItem>
            <Button type="primary" htmlType="submit">
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
        {/* <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div> */}
      </div>
    );
  }
}

export default BaseView;
