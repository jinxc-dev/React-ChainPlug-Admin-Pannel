import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import {
  Comment,
  Avatar,
  List,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Row,
  Col,
  Divider,
  Tooltip,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import { getRole } from '@/utils/authority';
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

const users = [
  { companyId: 'CPCACE3685', firstName: 'Fed', lastName: 'Man', email: 'fed@chainplug.io' }
  // {
  //   companyId: 'CPCACE3685',
  //   firstName: 'Zhang',
  //   lastName: 'MingMing',
  //   email: 'Jmm2965943@outlook.com',
  // },
  // { companyId: 'CPCACE3685', firstName: 'ABC', lastName: 'DEF', email: 'def@gmail.com' },
  // { companyId: 'CPCACE3685', firstName: 'BCD', lastName: 'EFG', email: 'efg@gmail.com' },
  // { companyId: 'CPCACE3685', firstName: 'CDE', lastName: 'FGH', email: 'fgh@gmail.com' },
];

const CommentList = ({ events }) => {
  const comments = events
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(event => {
      let stateTxt = '';
      if (event.type === 'state-change') {
        stateTxt = event.changedFields[event.changedFields.length - 1].newValue;
        stateTxt = `${formatMessage({ id: 'certificate.txt.task.is' })} ${formatMessage({
          id: `certificate.state.${stateTxt}`,
        })}`;
      }

      return {
        author: event.user,
        avatar: (
          <Avatar style={{ backgroundColor: '#565656e0', verticalAlign: 'middle' }}>
            {event.user.substr(0, 2).toUpperCase()}
          </Avatar>
        ),
        content: (
          <div>
            <p style={{ color: '#2196f3', textDecoration: 'underline' }}>{stateTxt}</p>
            <p>{event.comment}</p>
          </div>
        ),
        datetime: (
          <Tooltip title={moment(event.date).format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment(event.date).fromNow()}</span>
          </Tooltip>
        ),
      };
    });

  return (
    <List
      dataSource={comments}
      header={`${comments.length} ${formatMessage({
        id: `certificate.txt.reply${comments.length > 1 ? 's' : ''}`,
      })}`}
      itemLayout="horizontal"
      renderItem={props => <Comment {...props} className={styles.comment} />}
    />
  );
};

@connect(({ certificateForm, certificates }) => ({
  taskInfo: certificateForm.task,
  documents: certificates.documents,
}))
@Form.create()
class ApproveRequestForm extends Component {
  state = {
    newComment: '',
    newState: '',
    docList: [],
    errors: []
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    this.userRole = getRole();

    dispatch({
      type: 'certificateForm/getTaskInfo',
      payload: { taskId: params.id },
    });

    // dispatch({
    //   type: 'certificates/getDocuments',
    // });
  }

  onPrev = () => {
    router.push('/certification/tasks');
  };

  onValidateForm = e => {
    e.preventDefault();
    this.setState({errors: []});
    const { form, dispatch } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        const params = Object.keys(values).reduce(
          (result, key) => (values[key] ? { ...result, [key]: values[key] } : result),
          {}
        );
        dispatch({
          type: 'certificateForm/updateTaskInfo',
          payload: params,
        });
      }else{
        // console.log(err);
        let errors = Object.keys(err).map(key => err[key].errors.length ? err[key].errors[0].message : '');
        this.setState({errors: errors});
      }
    });
  };

  handlePostComment = () => {
    const { newComment } = this.state;
    const { taskInfo, dispatch, form } = this.props;
    const { setFieldsValue } = form;
    if (!newComment) return;

    dispatch({
      type: 'certificateForm/postTaskComment',
      payload: { taskId: taskInfo.taskId, comment: newComment },
    });

    setFieldsValue({ comment: '' });
    this.setState({ newComment: '' });
  };

  handleChangeComment = e => {
    this.setState({
      newComment: e.target.value,
    });
  };

  handleChangeState = value => {
    this.setState({ newState: value });
  };

  handleFilterDoc = val => {
    const { documents } = this.props;
    if (val) {
      const filteredDocList = documents.filter(
        d => !d.approvedOnTaskId && (d.cpid.includes(val) || d.name.includes(val))
      );
      this.setState({ docList: filteredDocList });
    } else {
      this.setState({ docList: documents });
    }
  };

  currentDocName() {
    const { taskInfo, documents } = this.props;
    const docName = documents.reduce(
      (name, d) => (d.documentId === taskInfo.documentId ? `${d.cpid} : ${d.name}` : name),
      ''
    );
    return docName;
  }

  ableStatus() {
    const {
      taskInfo: { state },
    } = this.props;
    const { newState } = this.state;
    // if (state === 'approved') {
    //   return <Select value={state} disabled />;
    // }

    const statusComp = [];
    // statusComp.push(
    //   <Option value={state} key={state}>
    //     {state}
    //   </Option>
    // );
    switch (state) {
      case 'requested':
        statusComp.push(
          <Option value="assigned" key="assigned">
            assigned
          </Option>
        );
        statusComp.push(
          <Option value="cancelled" key="cancelled">
            cancelled
          </Option>
        );
        break;
      case 'assigned':
        statusComp.push(
          <Option value="in-progress" key="in-progress">
            in-progress
          </Option>
        );
        statusComp.push(
          <Option value="cancelled" key="cancelled">
            cancelled
          </Option>
        );
        break;
      case 'in-progress':
        statusComp.push(
          <Option value="approved" key="approved">
            approved
          </Option>
        );
        statusComp.push(
          <Option value="cancelled" key="cancelled">
            cancelled
          </Option>
        );
        statusComp.push(
          <Option value="rejected" key="rejected">
            rejected
          </Option>
        );
        break;
      default:
        break;
    }

    const colorstatus = newState || state;
    return (
      <Select className={styles[colorstatus]} placeholder={state} onChange={this.handleChangeState}>
        {statusComp}
      </Select>
    );
  }

  stateCounter() {
    const { taskInfo } = this.props;
    const { events } = taskInfo;

    if (!events || !events.length) return false;

    let aDay;
    let aColor;
    let rDay;
    let rColor;
    events.forEach(event => {
      if (event.type === 'state-change') {
        const changedState = event.changedFields[event.changedFields.length - 1].newValue;
        if (changedState === 'assigned') aDay = event.date;
        else if (changedState === 'requested') rDay = event.date;
      }
    });

    if (rDay) {
      rDay = Math.floor((Date.now() - new Date(rDay).getTime()) / (24 * 3600 * 1000));
      rColor = rDay > 5 ? 'tomato' : 'limegreen';
    } else {
      rDay = 0;
      rColor = 'black';
    }

    if (aDay) {
      aDay = Math.floor((Date.now() - new Date(aDay).getTime()) / (24 * 3600 * 1000));
      aColor = aDay > 5 ? 'tomato' : 'limegreen';
    } else {
      aDay = 0;
      aColor = 'black';
    }

    return (
      <span>
        <span style={{ marginRight: '24px', color: aColor }}>
          {formatMessage({ id: 'certificate.assigned.txt' })} {aDay}{' '}
          {formatMessage({ id: `certificate.ago.day${aDay > 1 ? 's' : ''}` })}
        </span>
        <span style={{ color: rColor }}>
          {formatMessage({ id: 'certificate.requested.txt' })} {rDay}{' '}
          {formatMessage({ id: `certificate.ago.day${rDay > 1 ? 's' : ''}` })}
        </span>
      </span>
    );
  }

  render() {
    console.log(this.props);
    const { form, taskInfo } = this.props;
    const { getFieldDecorator } = form;
    const { docList, newState, errors } = this.state;

    const docOptions = docList.map(d => (
      <Option value={d.documentId} key={d.documentId}>{`${d.cpid} : ${d.name}`}</Option>
    ));
    const userOptions = users.map(u => {
      return <Option key={u.email}>{u.email}</Option>;
    });

    const errorList = errors.map((err, index) => (<p key={index}>{err}</p>));

    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="certificate.requested.Form" />}
        action={this.stateCounter()}
      >
        <Card bordered={false}>
          <Form style={{ marginTop: 8 }}>
            <Row>
              <Col span={12} style={paddingStyle}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="certificate.task.id.label" />}
                >
                  {getFieldDecorator('taskId', { initialValue: taskInfo.taskId })(
                    <Input className={styles.disabled} disabled />
                  )}
                </FormItem>
              </Col>
              <Col span={12} style={paddingStyle}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="certificate.requested.label" />}
                >
                  <Input value={taskInfo.requestedBy} className={styles.disabled} disabled />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12} style={paddingStyle}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="certificate.authoritycompany.label" />}
                >
                  <Input value={taskInfo.authorityCompany} className={styles.disabled} disabled />
                </FormItem>
              </Col>
              <Col span={12} style={paddingStyle}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="certificate.contractoruser.label" />}
                >
                  <Input value={taskInfo.contractorUser} className={styles.disabled} disabled />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12} style={paddingStyle}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="certificate.contractorcompany.label" />}
                >
                  <Input value={taskInfo.contractorCompany} className={styles.disabled} disabled />
                </FormItem>
              </Col>
              <Col span={12} style={paddingStyle}>
                {taskInfo.state === 'approved' || this.userRole === 'contractor' ? (
                  <FormItem
                    {...formItemLayout}
                    label={<FormattedMessage id="certificate.assigned.label" />}
                  >
                    <Input value={taskInfo.assignedTo} className={styles.disabled} disabled />
                  </FormItem>
                ) : (
                  <FormItem
                    {...formItemLayout}
                    label={<FormattedMessage id="certificate.assigned.label" />}
                  >
                    {getFieldDecorator('assignedTo', {
                      initialValue: taskInfo.assignedTo,
                    })(
                      <Select
                        showSearch
                        placeholder={formatMessage({ id: 'certificate.assigned.validation' })}
                        defaultActiveFirstOption
                        showArrow={false}
                        filterOption
                        // onSearch={this.handleSearch}
                        // onChange={this.handleChange}
                        notFoundContent={null}
                      >
                        {userOptions}
                      </Select>
                    )}
                  </FormItem>
                )}
              </Col>
            </Row>

            <Row>
              <Col span={12} style={paddingStyle}>
                {this.userRole === 'contractor' || taskInfo.state === 'approved' ? (
                  <FormItem
                    {...formItemLayout}
                    label={<FormattedMessage id="certificate.state.label" />}
                  >
                    <Input value={taskInfo.state} className={styles.disabled} disabled />
                  </FormItem>
                ) : (
                  <Form.Item
                    {...formItemLayout}
                    label={<FormattedMessage id="certificate.state.label" />}
                  >
                    {getFieldDecorator('state', {
                      initialValue: taskInfo.state,
                    })(this.ableStatus())}
                  </Form.Item>
                )}
              </Col>
              <Col span={12} style={paddingStyle}>
                {this.userRole === 'contractor' || taskInfo.state === 'approved' ? (
                  <FormItem
                    {...formItemLayout}
                    label={<FormattedMessage id="certificate.document.name.label" />}
                  >
                    <Input value={this.currentDocName()} className={styles.disabled} disabled />
                  </FormItem>
                ) : (
                  <FormItem
                    {...formItemLayout}
                    label={<FormattedMessage id="certificate.document.name.label" />}
                  >
                    {getFieldDecorator('documentId', {
                      initialValue: taskInfo.documentId,
                      rules: [
                        {
                          required: newState === 'approved',
                          message: formatMessage({ id: 'certificate.document.name.validation' }),
                        },
                      ],
                    })(
                      <Select
                        showSearch
                        placeholder={formatMessage({ id: 'certificate.document.name.validation' })}
                        defaultActiveFirstOption
                        showArrow={false}
                        filterOption={false}
                        onSearch={this.handleFilterDoc}
                        onFocus={this.handleFilterDoc}
                        // onChange={this.handleFilterDoc}
                        notFoundContent={null}
                      >
                        {docOptions}
                      </Select>
                    )}
                  </FormItem>
                )}
              </Col>
            </Row>

            <Row>
              <Col span={24} style={paddingStyle}>
                {/* {this.userRole === 'contractor' ? ( */}
                  <FormItem
                    {...desciptionLayout}
                    label={<FormattedMessage id="certificate.description.label" />}
                  >
                    <TextArea
                      rows={3}
                      value={taskInfo.description}
                      className={styles.disabled}
                      disabled
                    />
                  </FormItem>
                {/* ) : (
                  <FormItem
                    {...desciptionLayout}
                    label={<FormattedMessage id="certificate.description.label" />}
                  >
                    {getFieldDecorator('description', {
                      initialValue: taskInfo.description,
                    })(<TextArea rows={3} />)}
                  </FormItem>
                )} */}
              </Col>
            </Row>

            <Row className={styles.custom_comment_group}>
              <Comment
                content={
                  <div>
                    <Form.Item>
                      {getFieldDecorator('comment')(
                        <TextArea
                          rows={4}
                          placeholder={formatMessage({ id: 'certificate.comment.validation' })}
                          onChange={this.handleChangeComment}
                        />
                      )}
                    </Form.Item>
                    <Button
                      type="primary"
                      style={{ float: 'right' }}
                      onClick={this.handlePostComment}
                    >
                      <FormattedMessage id="form.post.comment" />
                    </Button>
                  </div>
                }
              />
              {taskInfo.events && taskInfo.events.length > 0 && (
                <CommentList events={taskInfo.events} />
              )}
            </Row>

            <Divider style={{ margin: '40px 0 24px' }} />
            <Row>
              <Col span={12} style={paddingStyle}>
                {this.userRole === 'contractor' ? (
                  <FormItem
                    {...formItemLayout}
                    label={<FormattedMessage id="chains.blockchain.name.label" />}
                  >
                    <Input value={taskInfo.blockchainName} className={styles.disabled} disabled />
                  </FormItem>
                ) : (
                  <FormItem
                    {...formItemLayout}
                    label={<FormattedMessage id="chains.blockchain.name.label" />}
                  >
                    {getFieldDecorator('blockchainName', { initialValue: taskInfo.blockchainName })(
                      <Input
                        placeholder={formatMessage({ id: 'chains.blockchain.name.placeholder' })}
                      />
                    )}
                  </FormItem>
                )}
              </Col>
              <Col span={12} style={paddingStyle}>
                {this.userRole === 'contractor' ? (
                  <FormItem
                    {...formItemLayout}
                    label={<FormattedMessage id="chains.blockchain.deploymenttime.label" />}
                  >
                    <Input
                      value={taskInfo.blockchainDeploymentTime}
                      className={styles.disabled}
                      disabled
                    />
                  </FormItem>
                ) : (
                  <FormItem
                    {...formItemLayout}
                    label={<FormattedMessage id="chains.blockchain.deploymenttime.label" />}
                  >
                    {getFieldDecorator('blockchainDeploymentTime', {
                      initialValue: taskInfo.blockchainDeploymentTime,
                    })(
                      <DatePicker
                        style={{ width: '100%' }}
                        placeholder={formatMessage({
                          id: 'chains.blockchain.deploymenttime.placeholder',
                        })}
                      />
                    )}
                  </FormItem>
                )}
              </Col>
            </Row>
            <Row>
              <Col span={12} style={paddingStyle}>
                {this.userRole === 'contractor' ? (
                  <FormItem
                    {...formItemLayout}
                    label={<FormattedMessage id="chains.blockchain.receiver.label" />}
                  >
                    <Input
                      value={taskInfo.blockchainReceiverAddress}
                      className={styles.disabled}
                      disabled
                    />
                  </FormItem>
                ) : (
                  <FormItem
                    {...formItemLayout}
                    label={<FormattedMessage id="chains.blockchain.receiver.label" />}
                  >
                    {getFieldDecorator('blockchainReceiverAddress', {
                      initialValue: taskInfo.blockchainReceiverAddress,
                    })(
                      <Input
                        placeholder={formatMessage({
                          id: 'chains.blockchain.receiver.placeholder',
                        })}
                      />
                    )}
                  </FormItem>
                )}
              </Col>
              <Col span={12} style={paddingStyle}>
                {this.userRole === 'contractor' ? (
                  <FormItem
                    {...formItemLayout}
                    label={<FormattedMessage id="chains.blockchain.sender.label" />}
                  >
                    <Input
                      value={taskInfo.blockchainSenderAddress}
                      className={styles.disabled}
                      disabled
                    />
                  </FormItem>
                ) : (
                  <FormItem
                    {...formItemLayout}
                    label={<FormattedMessage id="chains.blockchain.sender.label" />}
                  >
                    {getFieldDecorator('blockchainSenderAddress', {
                      initialValue: taskInfo.blockchainSenderAddress,
                    })(
                      <Input
                        placeholder={formatMessage({ id: 'chains.blockchain.sender.placeholder' })}
                      />
                    )}
                  </FormItem>
                )}
              </Col>
            </Row>
            <Row>
              <Col span={12} style={paddingStyle}>
                {this.userRole === 'contractor' ? (
                  <FormItem
                    {...formItemLayout}
                    label={<FormattedMessage id="chains.blockchain.contract.label" />}
                  >
                    <Input
                      value={taskInfo.blockchainSmartContractAddress}
                      className={styles.disabled}
                      disabled
                    />
                  </FormItem>
                ) : (
                  <FormItem
                    {...formItemLayout}
                    label={<FormattedMessage id="chains.blockchain.contract.label" />}
                  >
                    {getFieldDecorator('blockchainSmartContractAddress', {
                      initialValue: taskInfo.blockchainSmartContractAddress,
                    })(
                      <Input
                        placeholder={formatMessage({
                          id: 'chains.blockchain.contract.placeholder',
                        })}
                      />
                    )}
                  </FormItem>
                )}
              </Col>
              <Col span={12} style={paddingStyle}>
                {this.userRole === 'contractor' ? (
                  <FormItem
                    {...formItemLayout}
                    label={<FormattedMessage id="chains.blockchain.tx.label" />}
                  >
                    <Input
                      value={taskInfo.blockchainTxAddress}
                      className={styles.disabled}
                      disabled
                    />
                  </FormItem>
                ) : (
                  <FormItem
                    {...formItemLayout}
                    label={<FormattedMessage id="chains.blockchain.tx.label" />}
                  >
                    {getFieldDecorator('blockchainTxAddress', {
                      initialValue: taskInfo.blockchainTxAddress,
                    })(
                      <Input
                        placeholder={formatMessage({ id: 'chains.blockchain.tx.placeholder' })}
                      />
                    )}
                  </FormItem>
                )}
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
              {this.userRole === 'contractor' &&
                <Button onClick={this.onPrev}>
                  {' '}
                  <FormattedMessage id="form.cancel" />{' '}
                </Button>
              }
            </div>
            <div className={styles.btn_section} style={{color: 'red', margin: '12px 0px 0px'}}>
              {errorList}
            </div>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ApproveRequestForm;
