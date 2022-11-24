/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { socket } from '../../services/socket';
import { Button, Card, Container, Col, Row, CardBody, Input } from 'reactstrap';

import Swal from 'sweetalert2';

const TestPage = () => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    socket.on('game:reset-done', (gameEl) => {
      console.log(gameEl);
    });

    socket.on('user:reset-done', (userInfo) => {
      console.log(userInfo);
    });

    socket.on('user:reset-all-done', (message) => {
      console.log(message);
    });
  }, []);

  const onResetGame = () => {
    socket.emit('game:reset', roomId);
  };

  const onSpecificReset = () => {
    socket.emit('user:reset', name);
  };

  const onAllReset = () => {
    Swal.fire({
      title: 'ARE YOU SURE?',
      showDenyButton: true,
      confirmButtonText: 'YES',
      denyButtonText: `NAH`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('Saved!', '', 'success');
        socket.emit('user:reset-all');
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  };

  return (
    <>
      <Container className="mt--6 pb-5" fluid>
        <Row className="justify-content-center mx-auto">
          <Col md="5">
            <Card
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '3px solid white',
              }}
            >
              <CardBody className="px-lg-5 py-lg-5">
                <Row>
                  <Col>
                    <Input
                      bsSize="lg"
                      className="mt-4"
                      placeholder="roomId"
                      onChange={(e) => setRoomId(e.target.value)}
                      value={roomId}
                    />
                  </Col>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onResetGame}
                      size="lg"
                      color="danger"
                    >
                      Game: reset
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Input
                      bsSize="lg"
                      className="mt-4"
                      placeholder="name"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                    />
                  </Col>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onSpecificReset}
                      size="lg"
                      color="danger"
                    >
                      Reset: Specific
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onAllReset}
                      size="lg"
                      color="primary"
                    >
                      user:reset-all
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TestPage;
