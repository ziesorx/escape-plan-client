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
    socket.on('room:create-done', (roomId, avatarId) => {
      console.log(roomId, avatarId);
    });

    socket.on('room:join-done', (name, avatarId, roomId) => {
      console.log(name, avatarId, roomId);
    });

    socket.on('room:start-done', (gameEl) => {
      console.log(gameEl);
    });

    socket.on('room:leave-done', (userInfo) => {
      console.log(userInfo);
    });

    socket.on('room:delete-done', (socketRoom) => {
      console.log(socketRoom);
    });

    socket.on('room:current-done', (socketRoom) => {
      console.log(socketRoom);
    });

    socket.on('game:coor-done', (coor, role) => {
      console.log(coor, role);
    });

    socket.on('game:again-done', (gameEl) => {
      console.log(gameEl);
    });

    socket.on('game:again-done', (gameEl) => {
      console.log(gameEl);
    });

    socket.on('game:again-done', (gameEl) => {
      console.log(gameEl);
    });
  }, []);

  const onCreate = () => {
    socket.emit('room:create', 'Jackie', 1);
  };

  const onJoin = () => {
    socket.emit('room:join', 'Jimmy', 2);
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
