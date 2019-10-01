import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { DashCard } from '@/components/Charts';
import numeral from 'numeral';

const topColResponsiveProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 8,
  style: { marginBottom: 24 },
};

const IntroduceRow = memo(({ loading, visitData }) => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <DashCard
        bordered
        title={
          <FormattedMessage id="dashboard.report.myCertificate" defaultMessage="My certificate" />
        }
        action={
          <Tooltip title={<FormattedMessage id="dashboard.introduce" defaultMessage="Introduce" />}>
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        loading={loading}
        icon="/icons/certificate.png"
        total={numeral(visitData.totalCertificate).format('0,0')}
        footerLabel={<FormattedMessage id="dashboard.report.average.request.daily" />}
        footerValue={numeral(visitData.average_certificate).format('0,0.00')}
      />
    </Col>

    <Col {...topColResponsiveProps}>
      <DashCard
        bordered
        loading={loading}
        title={
          <FormattedMessage
            id="dashboard.report.myCertificateProgress"
            defaultMessage="My certificate in progress"
          />
        }
        action={
          <Tooltip title={<FormattedMessage id="dashboard.introduce" defaultMessage="Introduce" />}>
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        icon="/icons/progress.png"
        total={numeral(visitData.totalProgress).format('0,0')}
        footerLabel={<FormattedMessage id="dashboard.report.average.approve.daily" />}
        footerValue={numeral(visitData.average_approved).format('0,0.00')}
      />
    </Col>
    <Col {...topColResponsiveProps}>
      <DashCard
        bordered
        loading={loading}
        title={
          <FormattedMessage
            id="dashboard.report.myCertificateExpire"
            defaultMessage="My certificate about to expire"
          />
        }
        action={
          <Tooltip title={<FormattedMessage id="dashboard.introduce" defaultMessage="Introduce" />}>
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        icon="/icons/expiry.png"
        total={numeral(visitData.will_expired).format('0,0')}
        footerLabel={<FormattedMessage id="dashboard.report.average.expire.daily" />}
        footerValue={numeral(visitData.expired).format('0,0.00')}
      />
    </Col>
  </Row>
));

export default IntroduceRow;
