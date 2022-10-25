/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { socket } from '../services/socket';
import Router from 'next/router';
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

import { avatars } from '../variables/avatars';
import Swal from 'sweetalert2';
import { setUser, setOpponent } from '../store/features/userSlice';
import { setCurrentPlayer, setCurrentRoom } from '../store/features/roomSlice';

const LandingPage = () => {
  const [roomId, setRoomId] = useState('');
  const [disCreateButton, setDisCreateButton] = useState(false);
  const [disJoinButton, setDisJoinButton] = useState(false);
  const [joinRoom, setJoinRoom] = useState(false);

  const dispatch = useDispatch();
  const invalidRoom = false;

  useEffect(() => {
    socket.on('room:create-done', (roomDetails) => {
      dispatch(setCurrentRoom(roomDetails));
      dispatch(setCurrentPlayer(roomDetails.users.length));
      dispatch(setUser(roomDetails.users[0]));
      console.log(roomDetails.users.length);
      console.log(roomDetails);
      console.log(roomDetails.users[0]);
    });

    socket.on('room:join-done', (roomDetails) => {
      dispatch(setCurrentRoom(roomDetails));
      dispatch(setCurrentPlayer(roomDetails.users.length));
      dispatch(setOpponent(roomDetails.users[1]));
      console.log(roomDetails.users.length);
      console.log(roomDetails);
    });
  }, []);

  const onCreateClick = () => {
    setDisCreateButton(true);

    socket.emit('room:create');

    Router.push('/waiting-room');
  };

  const onJoinClick = () => {
    setDisJoinButton(true);

    Swal.fire({
      title: 'Joining Room',
      timer: 1500,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();

        socket.emit('room:join', roomId);

        socket.on('room:error', (message) => {
          if (message != null) {
            invalidRoom = true;
          }
        });
      },
    }).then((result) => {
      if (invalidRoom === true) {
        Swal.fire({
          title: `There is no such room`,
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
        }).then((result) => {
          setDisJoinButton(false);
        });
      } else {
        Swal.fire({
          title: `Welcome ${name}!`,
          text: `Joined room ${roomId}`,
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        }).then((result) => {
          setDisJoinButton(false);
          setRoomId(roomId);
        });
        socket.emit('room:join', roomId);
        Router.push('/waiting-room');
      }
    });
  };

  const renderSpinner = () => {
    return <Spinner animation="border" role="status" size="sm"></Spinner>;
  };

  return (
    <>
      <Container className="mt--6 pb-5" fluid>
        <Row className="justify-content-center mx-auto">
          <Col md="5">
            <Card className="main-card">
              <CardBody className="p-0 d-flex flex-column justify-content-center">
                <Row className="m-0 align-items-center h-100">
                  <Col className="text-center">
                    <Row className="flex-column">
                      <Col className="display-6 mb-3">Hi there!</Col>
                      <Col className="h5">
                        Create Room now to
                        <br />
                        play with friend!
                      </Col>

                      <Col className="px-lg-5">
                        <Button
                          block
                          className="mt-4 btn-create"
                          onClick={onCreateClick}
                          disabled={disCreateButton}
                          size="lg"
                        >
                          {disCreateButton ? renderSpinner() : 'Create Room'}
                        </Button>
                      </Col>
                    </Row>
                  </Col>

                  <Col className="text-center overlay h-100 d-flex justify-content-center flex-column">
                    <Row className="flex-column">
                      <Col className="display-6 mb-3">
                        Already
                        <br />
                        have room?
                      </Col>
                      <Col className="h5">
                        Join Room and
                        <br />
                        enjoy with friend!
                      </Col>

                      <Col className="px-lg-5">
                        <Input
                          className="mt-4"
                          bsSize="lg"
                          placeholder="Enter room id..."
                          onChange={(e) => setRoomId(e.target.value)}
                          value={roomId}
                        />

                        <Button
                          block
                          className="mt-3 btn-light"
                          onClick={onJoinClick}
                          disabled={disJoinButton}
                          size="lg"
                        >
                          {disJoinButton ? renderSpinner() : 'Join Room'}
                        </Button>
                      </Col>
                    </Row>
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

export default LandingPage;
