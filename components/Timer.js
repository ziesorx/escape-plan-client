import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import Countdown from 'react-countdown';

const Timer = () => {
  const renderer = ({ seconds }) => {
    // Render a countdown
    return <span className="display-3">{seconds}</span>;
  };

  return (
    <Row>
      <Col>
        <Countdown renderer={renderer} date={Date.now() + 10000} />
      </Col>
    </Row>
  );
};

export default Timer;
