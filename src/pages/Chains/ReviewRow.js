import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { DashCard } from '@/components/Charts';
import numeral from 'numeral';

const topColResponsiveProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 8,
  style: { marginBottom: 24 },
};

const ReviewRow = memo(({ loading, visitData }) => {
  const widgets = visitData.map(data => {
    return (
      <Col {...topColResponsiveProps} key={data.title}>
        <DashCard
          bordered
          title={<FormattedMessage id={data.title} />}
          action={
            <Tooltip
              title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          loading={loading}
          icon={data.icon}
          total={numeral(data.mainValue).format('0,0')}
          footerLabel={<FormattedMessage id={data.subTitle} />}
          footerValue={numeral(data.subValue).format('0,0.00')}
        />
      </Col>
    );
  });

  return <Row gutter={24}>{widgets}</Row>;
});

export default ReviewRow;
