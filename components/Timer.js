import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import Countdown from 'react-countdown';

export const Timer = () => {
  const Completionist = () => <span>You are good to go!</span>;

  const renderer = ({ seconds, completed }) => {
    if (completed) {
      return <span>time out</span>;
    } else {
      // Render a countdown
      return <span className="display-3">{seconds}</span>;
    }
  };

  return (
    <Row>
      <Col>
        <Countdown renderer={renderer} date={Date.now() + 10000} />
      </Col>
    </Row>
  );
};
