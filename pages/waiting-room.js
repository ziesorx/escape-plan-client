/* eslint-disable @next/next/no-img-element */
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { avatars } from '../variables/avatars';
import Swal from 'sweetalert2';

import {
  Button,
  Card,
  CardBody,
  Container,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

import userSlice, {
  clearOpponent,
  clearUser,
  setUser,
} from '../store/features/userSlice';
import {
  clearCurrentPlayer,
  clearCurrentRoom,
  setCurrentPlayer,
} from '../store/features/roomSlice';
import { current } from '@reduxjs/toolkit';
import { socket } from '../services/socket';

const Waiting = () => {
  const { user } = useSelector(state => state.user);
  const { opponent } = useSelector(state => state.user);
  const { currentRoom } = useSelector(state => state.room);
  const { currentPlayer } = useSelector(state => state.room);
  const [isPlayerLeft, setIsPlayerLeft] = useState(false);

  const userAvatar = avatars.filter(avatar => avatar.id === user.avatarId);
  const opponentAvatar = avatars.filter(
    avatar => avatar.id === opponent.avatarId
  );
  const userName = user.name;
  const opponentName = opponent.name;

  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('room:starting-done', message => {
      let timerInterval;
      Swal.fire({
        allowOutsideClick: false,
        title: 'GAME STARTED!',
        html: 'Game will start in <strong></strong> seconds. <br></br>',
        timer: 5300,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const b = Swal.getHtmlContainer().querySelector('strong');
          timerInterval = setInterval(() => {
            b.textContent = (Swal.getTimerLeft() / 1000).toFixed(0);
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then(result => {
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log(message);
          !!message && Router.push('/game-time');
        }
      });
    });

    socket.on('room:leave-done', roomDetails => {
      dispatch(setCurrentPlayer(roomDetails.users.length));
      dispatch(clearOpponent());
      console.log(roomDetails);
      setIsPlayerLeft(prev => !prev);
      dispatch(setUser({ ...user, isHost: true }));
    });
  }, []);

  useEffect(() => {
    if (user.isHost && isPlayerLeft)
      Swal.fire({
        title: 'YOU ARE HOST!',
        timer: 2000,
        timerProgressBar: true,
        icon: 'warning',
        showConfirmButton: false,
      }).then(result => setIsPlayerLeft(prev => !prev));
  }, [user.isHost, isPlayerLeft]);

  const backToIndex = () => {
    dispatch(clearCurrentRoom());
    dispatch(clearCurrentPlayer());
    dispatch(clearOpponent());
    socket.emit('room:leave');
    Router.push('/main-menu');
  };

  const toGameroom = () => {
    if (Object.keys(user).length === 0 || Object.keys(opponent).length === 0)
      Swal.fire({
        title: 'Error!',
        timer: 2000,
        timerProgressBar: true,
        text: 'Not enough player',
        icon: 'error',
        showConfirmButton: false,
      });
    else {
      console.log('starting');
      socket.emit('room:starting');
    }
  };

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  //console.log(currentRoom);

  // if (!currentRoom) return;

  const renderButton = () => {
    return (
      <Button color="danger" onClick={toGameroom} size="lg">
        <span className="fs-3">Start</span>
      </Button>
    );
  };

  return (
    <Container className="px-0">
      <Row className="justify-content-center">
        <Col md="10">
          <Card
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '3px solid white',
              // width: '80%',
            }}
          >
            <Row className="justify-content-center" style={{ gap: '2rem' }}>
              <Row>
                <div>
                  <Button
                    className="mt-2 mx-2 btn-create position-absolute top-0 start-0"
                    onClick={backToIndex}
                  >
                    Back
                  </Button>
                  <Row className="justify-content-center">
                    <Col md="4">
                      <CardBody className="text-center fs-1">
                        <span className="fs-3">Room ID</span>
                        <br />
                        <span className="display-3">
                          {currentRoom === null ? '????' : currentRoom.id}
                        </span>
                      </CardBody>
                    </Col>
                  </Row>
                </div>
              </Row>
              <Row className="justify-content-center">
                <Col md="4">
                  <Card className="text-md-center fs-2">
                    <Row>
                      <span>
                        {Object.keys(user).length === 0 ? '???' : userName}
                      </span>
                    </Row>
                    <Row>
                      <img
                        src={
                          Object.keys(user).length === 0
                            ? '/img/default.png'
                            : userAvatar[0]?.img_src
                        }
                        alt="Pacman avatar"
                      />
                    </Row>
                  </Card>
                </Col>
                <Col md="4">
                  <img
                    src="/img/vs-logo.png"
                    className="img-fluid"
                    alt="versus logo"
                  ></img>
                </Col>
                <Col md="4">
                  <Card className="text-md-center fs-2">
                    <Row>
                      <span>
                        {Object.keys(opponent).length === 0
                          ? '???'
                          : opponentName}
                      </span>
                      <span></span>
                    </Row>
                    <Row>
                      <img
                        src={
                          Object.keys(opponent).length === 0
                            ? '/img/default.png'
                            : opponentAvatar[0]?.img_src
                        }
                        alt="Pacman avatar"
                      />
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col md="3" className="text-center">
                  {user.isHost && renderButton()}
                </Col>
              </Row>
              <Row>
                <Col md="4" className="align-vertical-center">
                  <FontAwesomeIcon icon={faUser} size="2x" className="" />
                  &nbsp;<span className="fs-1">{currentPlayer}</span>
                </Col>
                <Col md="4"></Col>
                <Col md="4">
                  <Button
                    className="mb-2 mx-2 btn-create position-absolute bottom-0 end-0"
                    onClick={toggle}
                  >
                    ?
                  </Button>
                </Col>
                <Modal isOpen={modal} toggle={toggle}>
                  <ModalHeader toggle={toggle}>
                    How to play this game
                  </ModalHeader>
                  <ModalBody>
                    One day, there is a man whos a chad, namely Pond, and he
                    stole the most prestiegeous diamond in the world from the
                    most famous shop keeper name Poraor. Try your best to escape
                    or catch the chad!!!
                    <Card>
                      <img src="/img/gigachad.jpeg" alt="gigachad"></img>
                    </Card>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="dark" onClick={toggle}>
                      Close
                    </Button>{' '}
                  </ModalFooter>
                </Modal>
              </Row>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Waiting;
