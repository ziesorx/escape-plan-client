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
    socket.on('user:error', message => {
      console.log(message);
    });

    socket.on('room:error', message => {
      console.log(message);
    });

    socket.on('user:login-done', userInfo => {
      console.log(userInfo);
    });

    socket.on('user:info-done', userInfo => {
      console.log(userInfo);
    });

    socket.on('user:get-all-done', userInSocket => {
      console.log(userInSocket);
    });

    socket.on('room:create-done', roomDetail => {
      console.log(roomDetail);
    });

    socket.on('room:join-done', roomDetail => {
      console.log(roomDetail);
    });

    socket.on('room:start-done', gameEl => {
      console.log(gameEl);
    });

    socket.on('room:starting-done', userInfo => {
      console.log(userInfo);
    });

    // socket.on('room:delete-done', (socketRooms) => {
    //   console.log(socketRooms);
    // });

    // socket.on('room:current-done', (socketRooms) => {
    //   console.log(socketRooms);
    // });

    socket.on('game:update-done', (coor, isWarderTurn) => {
      console.log(coor, isWarderTurn);
    });

    // socket.on('game:again-done', (gameEl) => {
    //   console.log(gameEl);
    // });

    // socket.on('user:info-done', (userInSocket) => {
    //   console.log(userInSocket);
    // });

    // socket.on('user:score-done', (userInfo) => {
    //   console.log(userInfo);
    // });
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
    socket.emit('room:start', name, name2);
  };

  const onGetAllUser = () => {
    socket.emit('user:get-all');
  };

  const onGetUserInfo = () => {
    socket.emit('user:info');
  };

  const onLeave = () => {
    socket.emit('room:starting');
  };

  const onCoorUpdate = () => {
    socket.emit('game:update', [0, 0], true);
  };

  // const onRoomDelete = () => {
  //   socket.emit('room:delete');
  // };

  // const onCurrentRoom = () => {
  //   socket.emit('room:current');
  // };

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
                      onChange={e => setName(e.target.value)}
                      value={name}
                    />
                    <Button
                      block
                      className="mt-4"
                      onClick={onLogin1}
                      size="lg"
                      color="primary"
                    >
                      user:login1
                    </Button>
                  </Col>
                  <Col>
                    <Input
                      bsSize="lg"
                      placeholder="name2"
                      onChange={e => setName2(e.target.value)}
                      value={name2}
                    />
                    <Button
                      block
                      className="mt-4"
                      onClick={onLogin2}
                      size="lg"
                      color="primary"
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
                      onChange={e => setRoomId(e.target.value)}
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
                      onClick={onGetAllUser}
                      size="lg"
                      color="primary"
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
                      color="primary"
                    >
                      user:info
                    </Button>
                  </Col>
                </Row>
                {/* <Row>
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
                </Row>*/}
                <Row>
                  <Col>
                    <Button
                      block
                      className="mt-4"
                      onClick={onCoorUpdate}
                      size="lg"
                      style={{ backgroundColor: '#558747' }}
                    >
                      game:update
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
