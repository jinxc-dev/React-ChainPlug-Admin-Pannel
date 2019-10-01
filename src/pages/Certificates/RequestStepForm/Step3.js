import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Divider } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import Result from '@/components/Result';
import styles from './style.less';

@connect(({ certificateForm }) => ({
  data: certificateForm.step,
}))
class Step3 extends React.PureComponent {
  render() {
    const {
      data: { response },
      dispatch,
    } = this.props;
    if (!response) router.push('/certification/step-form/confirm');

    const infoComp = (
      <div>
        <div className={styles.information}>
          <div>
            <span className={styles.label}>
              {formatMessage({ id: 'certificate.task.id.label' })}:
            </span>
            <span>{response.taskId}</span>
          </div>
          <div>
            <span className={styles.label}>
              {formatMessage({ id: 'certificate.description.label' })}:
            </span>
            <span>{response.description}</span>
          </div>
          <div>
            <span className={styles.label}>
              {formatMessage({ id: 'certificate.requested.label' })}:
            </span>
            <span>{response.requestedBy}</span>
          </div>
          <div>
            <span className={styles.label}>
              {formatMessage({ id: 'certificate.contractoruser.label' })}:
            </span>
            <span>{response.contractorUser}</span>
          </div>
          <div>
            <span className={styles.label}>
              {formatMessage({ id: 'certificate.authoritycompany.label' })}:
            </span>
            <span>{response.authorityCompany}</span>
          </div>
          <div>
            <span className={styles.label}>
              {formatMessage({ id: 'certificate.contractorcompany.label' })}:
            </span>
            <span>{response.contractorCompany}</span>
          </div>
        </div>
      </div>
    );

    const onFinish = () => {
      dispatch({
        type: 'form/saveStepFormData',
        payload: { description: '', response: null },
      });
      router.push('/certification/tasks');
    };

    return (
      <Fragment>
        <Result
          type="success"
          title={<FormattedMessage id="certificate.request.summary" />}
          description=""
          // extra={information}
          // actions={actions}
          className={styles.result}
        />
        <Divider style={{ margin: '40px 0 24px' }} />
        {infoComp}
        <div className={styles.btn_section} style={{ marginTop: '20px' }}>
          <Button type="primary" onClick={onFinish}>
            {' '}
            Close{' '}
          </Button>
        </div>
      </Fragment>
    );
  }
}

export default Step3;
