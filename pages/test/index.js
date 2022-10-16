/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { socket } from '../../services/socket';
import {
  Button,
  Card,
  Container,
  Col,
  Row,
  CardBody,
  Input,
  Spinner,
  ButtonGroup,
} from 'reactstrap';

import { avatars } from '../../variables/avatars';

const TestPage = () => {
  useEffect(() => {
    socket.on('room:create-done', roomId => {
      console.log(roomId);
    });

    socket.on('room:join-done', gameEl => {
      console.log(gameEl);
    });

    socket.on('user:leave-done', () => {});

    socket.on('disconnect-done', () => {});

    socket.on('coor:update-done', () => {});

    socket.on('room:delete-done', () => {});

    socket.on('room:current-done', () => {});
  }, []);

  const onCreate = () => {
    socket.emit('room:create');
  };

  const onJoin = () => {
    socket.emit('room:join');
  };

  const onLeave = () => {
    socket.emit('user:leave');
  };

  const onDisconnect = () => {
    socket.emit('disconnect');
  };

  const onCoorUpdate = () => {
    socket.emit('coor:update');
  };

  const onRoomDelete = () => {
    socket.emit('room:delete');
  };

  const onCurrentRoom = () => {
    socket.emit('room:current');
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
                    <Button
                      block
                      className="mt-4"
                      onClick={onCreate}
                      size="lg"
                      color="primary"
                    >
                      room:create
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onJoin}
                      size="lg"
                      color="primary"
                    >
                      room:join
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onCurrentRoom}
                      size="lg"
                      color="primary"
                    >
                      room:current
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onRoomDelete}
                      size="lg"
                      color="primary"
                    >
                      room:delete
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onCoorUpdate}
                      size="lg"
                      style={{ backgroundColor: '#8c26e0' }}
                    >
                      coor:update
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onLeave}
                      size="lg"
                      color="danger"
                    >
                      user:leave
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onDisconnect}
                      size="lg"
                      style={{ backgroundColor: '#558747' }}
                    >
                      disconnect
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
