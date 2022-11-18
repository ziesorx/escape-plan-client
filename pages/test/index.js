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
  const [name, setName] = useState('');
  const [name2, setName2] = useState('');
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    socket.on('user:error', (message) => {
      console.log(message);
    });

    socket.on('room:error', (message) => {
      console.log(message);
    });

    socket.on('game:error', (message) => {
      console.log(message);
    });

    socket.on('user:login-done', (userInfo) => {
      console.log(userInfo);
    });

    socket.on('room:create-done', (roomDetail) => {
      console.log(roomDetail);
    });

    socket.on('room:join-done', (roomDetail) => {
      console.log(roomDetail);
    });

    socket.on('room:start-done', (gameEl) => {
      console.log(gameEl);
    });

    socket.on('room:leave-done', (userInfo) => {
      console.log(userInfo);
    });

    socket.on('room:starting-done', (userInfo) => {
      console.log(userInfo);
    });

    socket.on('game:update-done', (coor, isWarderTurn) => {
      console.log(coor, isWarderTurn);
    });

    socket.on('game:end-done', (userInfo) => {
      console.log(userInfo);
    });

    socket.on('room:play-again-done', (gameEl) => {
      console.log(gameEl);
    });

    socket.on('user:get-all-done', (userInSocket) => {
      console.log(userInSocket);
    });

    socket.on('user:info-done', (userInfo) => {
      console.log(userInfo);
    });

    socket.on('test-done', (data) => {
      console.log(data);
    });

    socket.on('room:all-done', (roomInSocket) => {
      console.log(roomInSocket);
    });

    socket.on('room:current-done', (roomDetail) => {
      console.log(roomDetail);
    });

    socket.on('game:all-done', (gameEls) => {
      console.log(gameEls);
    });
  }, []);

  const onLogin1 = () => {
    socket.emit('user:login', name, 1);
  };

  const onLogin2 = () => {
    socket.emit('user:login', name2, 2);
  };

  const onCreate = () => {
    socket.emit('room:create');
  };

  const onJoin = () => {
    socket.emit('room:join', roomId);
  };

  const onStart = () => {
    socket.emit('room:start', name, 'jackie');
  };

  const onGetAllUser = () => {
    socket.emit('user:get-all');
  };

  const onGetUserInfo = () => {
    socket.emit('user:info');
  };

  const onLeave = () => {
    socket.emit('room:leave');
  };

  const onStarting = () => {
    socket.emit('room:starting');
  };

  const onPlayAgain = () => {
    socket.emit('room:play-again', 'jackie');
  };

  const onGameUpdateWarder = () => {
    socket.emit('game:update', [0, 0], true);
  };

  const onGameUpdatePrisoner = () => {
    socket.emit('game:update', [0, 3], false);
  };

  const onGameEnd = () => {
    socket.emit('game:end');
  };

  const onCurrentRoom = () => {
    socket.emit('room:current');
  };

  const onAllRoom = () => {
    socket.emit('room:all');
  };

  const onTest = () => {
    socket.emit('test');
  };

  const onAllGame = () => {
    socket.emit('game:all');
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
                      placeholder="name1"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                    />
                    <Button
                      block
                      className="mt-4"
                      onClick={onLogin1}
                      size="lg"
                      color="danger"
                    >
                      user:login1
                    </Button>
                  </Col>
                  <Col>
                    <Input
                      bsSize="lg"
                      placeholder="name2"
                      onChange={(e) => setName2(e.target.value)}
                      value={name2}
                    />
                    <Button
                      block
                      className="mt-4"
                      onClick={onLogin2}
                      size="lg"
                      color="danger"
                    >
                      user:login2
                    </Button>
                  </Col>
                </Row>
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
                    <Input
                      bsSize="lg"
                      placeholder="Room Id"
                      onChange={(e) => setRoomId(e.target.value)}
                      value={roomId}
                    />
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
                      onClick={onStart}
                      size="lg"
                      color="primary"
                    >
                      room:start
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onLeave}
                      size="lg"
                      color="primary"
                    >
                      room:leave
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onStarting}
                      size="lg"
                      color="primary"
                    >
                      room:starting
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onPlayAgain}
                      size="lg"
                      color="primary"
                    >
                      room:play-again
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onGameUpdateWarder}
                      size="lg"
                      style={{ backgroundColor: '#8c26e0' }}
                    >
                      game:update/Warder
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onGameUpdatePrisoner}
                      size="lg"
                      style={{ backgroundColor: '#8c26e0' }}
                    >
                      game:update/Prisoner
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onGameEnd}
                      size="lg"
                      style={{ backgroundColor: '#8c26e0' }}
                    >
                      game:end
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onGetAllUser}
                      size="lg"
                      style={{ backgroundColor: '#558747' }}
                    >
                      user:get-all
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onGetUserInfo}
                      size="lg"
                      style={{ backgroundColor: '#558747' }}
                    >
                      user:info
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onTest}
                      size="lg"
                      style={{ backgroundColor: '#558747' }}
                    >
                      test
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onAllRoom}
                      size="lg"
                      style={{ backgroundColor: '#558747' }}
                    >
                      room:all
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
                      style={{ backgroundColor: '#558747' }}
                    >
                      room:current
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onAllGame}
                      size="lg"
                      style={{ backgroundColor: '#558747' }}
                    >
                      game:all
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
