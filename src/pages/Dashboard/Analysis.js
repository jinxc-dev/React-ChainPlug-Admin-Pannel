import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Card, Row, Col } from 'antd';
import { Pie, TimelineChart } from '@/components/Charts';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
// import { getTimeDistance } from '@/utils/utils';
// import styles from './Analysis.less';
import PageLoading from '@/components/PageLoading';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));

@connect(({ certificates, loading }) => ({
  certificates,
  loading: loading.models.certificates,
}))
class Analysis extends Component {
  state = {
    msPerDay: 1000 * 60 * 60 * 24,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'certificates/getDocuments',
    // });
    // dispatch({
    //   type: 'certificates/getTasks',
    // });
  }

  daysByNow(sDate) {
    const { msPerDay } = this.state;
    const curDate = new Date();
    const utc1 = Date.UTC(sDate.getFullYear(), sDate.getMonth(), sDate.getDate());
    const utc2 = Date.UTC(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());

    const differ = Math.floor((utc2 - utc1) / msPerDay) + 1;
    return differ;
  }

  statisticDocs(docs) {
    const docCnt = docs.length ? docs.length : 0;
    let sDate = docCnt ? docs[0].createdAt : 0;
    let expiringDoc = 0;
    let expiredDoc = 0;

    const curTime = Date.now();

    docs.forEach(doc => {
      if (doc.createdAt < sDate) sDate = doc.createdAt;

      if (doc.expiryTime) {
        if (doc.expiryTime < curTime) expiredDoc += 1;
        else if (doc.expiryTime < curTime + 1000 * 60 * 60 * 24 * 30) expiringDoc += 1;
      }
    });

    sDate = new Date(sDate);
    const totalDays = this.daysByNow(sDate);

    return {
        totalCertificate: docCnt,
        average_certificate: Math.round((100 * docCnt) / totalDays) / 100,
        expired_cnt: Math.round((100 * expiredDoc) / totalDays) / 100,
        will_expired: expiringDoc,
    };
  }

  statisticTasks(tasks) {
    let taskCnt = 0;
    let progressCnt = 0;
    let approvedCnt = 0;
    let firstReqDate = 0;
    const tInfo = {};

    tasks.forEach(task => {
      taskCnt += 1;
      if (task.state === 'in-progress') progressCnt += 1;
      if (task.state === 'approved') approvedCnt += 1;

      if (task.events.length) {
        const ReqDate = task.events[0].date.substr(0, 10);
        if (firstReqDate === 0 || firstReqDate > ReqDate) firstReqDate = ReqDate;
      }

      if (task.type) tInfo[task.type] = tInfo[task.type] ? tInfo[task.type] + 1 : 1;
      else tInfo.Unknown = tInfo.Unknown ? tInfo.Unknown + 1 : 1;
    });

    const totalDays = this.daysByNow(new Date(firstReqDate));
    return {
      totalTask: taskCnt,
      totalProgress: progressCnt,
      average_approved: Math.round((100 * approvedCnt) / totalDays) / 100,
      typeInfo: tInfo,
    };
  }

  render() {
    console.log(this.props);
    const { loading, certificates } = this.props;
    const { tasks, documents } = certificates;

    const docInfos = this.statisticDocs(documents);
    const taskInfos = this.statisticTasks(tasks);

    // const { topInfo, typeInfo } = docInfos;
    const visitData = { ...docInfos, ...taskInfos };

    const typesPieData = Object.keys(taskInfos.typeInfo).map(key => {
      return { x: key, y: taskInfos.typeInfo[key] };
    });

    const chartData = [];
    for (let i = 0; i < 20; i += 1) {
      chartData.push({
        x: new Date().getTime() + 1000 * 60 * 30 * i,
        y1: Math.floor(Math.random() * 100) + 50,
        y2: Math.floor(Math.random() * 100) + 10,
      });
    }

    const chartProps = {
      sm: 24,
      md: 24,
      lg: 24,
      xl: 12,
      style: { margin: '12px 0px', padding: '0px 4px' },
    };

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow loading={loading} visitData={visitData} />
        </Suspense>
        <Suspense fallback={null}>
          <Card>
            <Row>
              <Col {...chartProps}>
                <p style={{ fontSize: '20px', fontWeight: '500' }}>Request type of certificate by status</p>
                <Pie
                  hasLegend
                  title="test chart"
                  subTitle="Total"
                  animate
                  total={visitData.totalTask}
                  height={294}
                  lineWidth={2}
                  data={typesPieData}
                />
              </Col>
              <Col {...chartProps}>
                <p style={{ fontSize: '20px', fontWeight: '500' }}>Certificate number by day</p>
                <TimelineChart
                  height={400}
                  data={chartData}
                  titleMap={{ y1: '客流量', y2: '支付笔数' }}
                />
              </Col>
            </Row>
          </Card>
        </Suspense>
      </GridContent>
    );
  }
}

export default Analysis;
