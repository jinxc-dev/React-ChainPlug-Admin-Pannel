import React from 'react';
import { Card } from 'antd';

import styles from './index.less';

class DashCard extends React.PureComponent {
  renderConnet = () => {
    const { title, icon, action, total, footerLabel, footerValue, loading } = this.props;
    if (loading) {
      return false;
    }
    return (
      <div className={styles.dashCard}>
        <div className={styles.title}>{title}</div>
        <div className={styles.content}>
          <img src={icon} alt="card avatar" />
          <div className={styles.total}>{total}</div>
          <span className={styles.action}>{action}</span>
        </div>
        <div className={styles.footer}>
          {footerLabel}&nbsp;&nbsp;
          <span>{footerValue}</span>
        </div>
      </div>
    );
  };

  render() {
    const {
      loading = false,
      title,
      icon,
      action,
      total,
      footerLabel,
      footerValue,
      ...rest
    } = this.props;
    return (
      <Card loading={loading} bodyStyle={{ padding: '20px 24px 8px 24px' }} {...rest}>
        {this.renderConnet()}
      </Card>
    );
  }
}

export default DashCard;
