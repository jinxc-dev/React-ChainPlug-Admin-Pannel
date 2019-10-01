import React from 'react';
import styled from 'styled-components';

const MarkerCounter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  // text-align: center;
  width: ${props => props.markerSize}px;
  height: ${props => props.markerSize}px;
  padding-top: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #000;
  background: url(/icons/m${props => props.markerSize}.png); //url(/icons/m1.png) no-repeat;
  position: absolute;
  top: -${props => props.markerSize}px;
  left: -${props => props.markerSize / 2}px;
`;

export default class ClusterMarker extends React.PureComponent {
  render() {
    const { points } = this.props;
    let size;
    if (points.length < 10) size = 52;
    else if (points.length < 100) size = 55;
    else if (points.length < 100) size = 65;
    else if (points.length < 100) size = 77;
    else size = 89;

    return (
      <div>
        {points.length > 1 && <MarkerCounter markerSize={size}>{points.length}</MarkerCounter>}
      </div>
    );
  }
}

// export default ClusterMarker;
