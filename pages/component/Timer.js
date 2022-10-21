import React, { useState } from 'react'
import { Row, Col } from 'reactstrap'
import Countdown from 'react-countdown'

const Timer = () => {
  const renderer = ({ minutes, seconds }) => {
    // Render a countdown
    return (
      <span className="display-6">
        0{minutes}:{seconds}
      </span>
    )
  }

  return (
    <Row>
      <Col>
        <Countdown renderer={renderer} date={Date.now() + 10000} />
      </Col>
    </Row>
  )
}

export default Timer
