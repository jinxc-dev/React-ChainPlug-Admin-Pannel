import React from 'react';
import styled from 'styled-components';
import { easyMove } from './style-constants';

const MarkerStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 39px;
  font-size: 14px;
  color: #fff;
  text-transform: uppercase;
  background: url(/icons/pin.png) no-repeat top;
  transition: transform 0.3s;
  animation: ${easyMove} 0.3s;
  position: absolute;
  top: -39px;
  left: -12px;

  &:hover {
    transform: scale(1.2);
  }
`;

export default class Marker extends React.PureComponent {
  render() {
    return (
      <div>
        <MarkerStyled />
      </div>
    );
  }
}

// export default Marker;
