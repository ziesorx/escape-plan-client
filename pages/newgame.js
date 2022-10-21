import React, { useState } from 'react'
import { Button, Card, Row, Col } from 'reactstrap'
import Header from './component/Header'
const newgame = () => {
  const [isPrisoner, setIsPrisoner] = useState(true)

  return (
    <Row>
      <Col className="position-relative mx-auto" sm="10" md="5">
        <Card
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '3px solid white',
          }}
        >
          <Header
            myImg={'/img/Bluepackman.png'}
            oppoImg={'/img/Greenpackman.png'}
            isPrisoner={true}
            myScore={2}
            oppoScore={300}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default newgame
