import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card } from 'antd';


@connect(({ loading }) => ({
}))
class CertificateDocumentList extends Component {

  render() {
    return (
        <Card bordered={false}>
            <h1>User Guide</h1>
        </Card>
    );
  }
}
export default CertificateDocumentList;
