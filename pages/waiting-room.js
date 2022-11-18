/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
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
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from 'reactstrap';

import userSlice, {
  clearOpponent,
  clearUser,
  setUser,
} from '../store/features/userSlice';
import {
  clearCurrentPlayer,
  clearCurrentRoom,
  setCurrentGame,
  setCurrentPlayer,
} from '../store/features/roomSlice';
import { socket } from '../services/socket';
import useSound from 'use-sound';
import { tutorials } from '../variables/tutorials';

const Waiting = () => {
  const { user } = useSelector(state => state.user);
  const { opponent } = useSelector(state => state.user);
  const { currentRoom } = useSelector(state => state.room);
  const { currentPlayer } = useSelector(state => state.room);
  const [isPlayerLeft, setIsPlayerLeft] = useState(false);

  const [mute, setMute] = useState(true);
  const option = { volume: 0.6, soundEnabled: !mute };
  const [playJoin] = useSound('/sounds/join.wav', option);

  const userAvatar = avatars.filter(avatar => avatar.id === user.avatarId);
  const opponentAvatar = avatars.filter(
    avatar => avatar.id === opponent.avatarId
  );
  const userName = user.name;
  const opponentName = opponent.name;

  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('room:start-done', gameElement => {
      console.log(gameElement);
      dispatch(setCurrentGame(gameElement));
    });

    socket.on('room:leave-done', roomDetails => {
      dispatch(setCurrentPlayer(roomDetails.users.length));
      dispatch(clearOpponent());
      console.log(roomDetails);
      setIsPlayerLeft(prev => !prev);
    });

    socket.on('user:disconnect', roomDetails => {
      if (roomDetails.users.length < 2) {
        let timerInterval;
        Swal.fire({
          title: `Other player has left the room!`,
          html: 'Leaving the room in <strong></strong> seconds.',
          timer: 5300,
          timerProgressBar: true,
          showDenyButton: true,
          showConfirmButton: false,
          denyButtonText: `Leave room`,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();

            const b = Swal.getHtmlContainer().querySelector('strong');
            timerInterval = setInterval(() => {
              b.textContent = (Swal.getTimerLeft() / 1000).toFixed(0);
            }, 100);
          },
        }).then(result => {
          if (result.isDenied || result.dismiss === Swal.DismissReason.timer) {
            dispatch(clearCurrentRoom());
            dispatch(clearCurrentPlayer());
            dispatch(clearOpponent());
            socket.emit('room:leave');
            Router.push('main-menu');
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (!mute) {
      playJoin();
      setMute(true);
    }
  }, [mute]);

  useEffect(() => {
    if (opponent.name) {
      socket.on('room:starting-done', () => {
        let timerInterval;
        Swal.fire({
          allowOutsideClick: false,
          title: 'GAME STARTED!',
          html: 'Game will start in <strong></strong> seconds. <br></br>',
          timer: 5300,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();

            if (user.isHost) {
              socket.emit('room:start', userName, opponentName);

              socket.on('room:error', message => {
                console.log(message);
              });
            }

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
            Router.push('/game-time');
          }
        });
      });
    }
  }, [opponent.name]);

  useEffect(() => {
    if (!user.isHost && isPlayerLeft) {
      dispatch(setUser({ ...user, isHost: true }));
      Swal.fire({
        title: 'YOU ARE HOST!',
        timer: 2000,
        timerProgressBar: true,
        icon: 'warning',
        showConfirmButton: false,
      }).then(result => setIsPlayerLeft(prev => !prev));
    }
  }, [user.isHost, isPlayerLeft]);

  useEffect(() => {
    if (currentPlayer === 2) {
      setMute(false);
    }
  }, [currentPlayer]);

  const backToIndex = e => {
    e.preventDefault();

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
      <Button
        color="danger"
        onClick={toGameroom}
        size="lg"
        disabled={currentPlayer !== 2 || !user.isHost}
        style={{ opacity: user.isHost ? 1 : 0 }}
      >
        <span className="fs-3">Start</span>
      </Button>
    );
  };

  // Tutorial Modal
  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const slides = tutorials.map(tutorial => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={tutorial.id}
      >
        <img src={tutorial.src} alt={tutorial.text} />
        <CarouselCaption
          className="text-dark"
          captionHeader={tutorial.header}
          captionText={tutorial.text}
        />
      </CarouselItem>
    );
  });

  const next = () => {
    if (animating) return;

    if (activeIndex < 2) setActiveIndex(prev => prev + 1);
  };

  const previous = () => {
    if (animating) return;

    if (activeIndex > 0) setActiveIndex(prev => prev - 1);
  };

  const goToIndex = newIndex => {
    if (animating) return;

    if (newIndex < 2) setActiveIndex(newIndex);
  };

  const renderModal = () => {
    return (
      <Modal isOpen={showModal} toggle={() => setShowModal(prev => !prev)}>
        <ModalHeader toggle={() => setShowModal(prev => !prev)}>
          Tutorial
        </ModalHeader>
        <ModalBody className="p-0">
          <div className="rounded-bottom overflow-hidden">
            <Carousel activeIndex={activeIndex} next={next} previous={previous}>
              <CarouselIndicators
                items={tutorials}
                activeIndex={activeIndex}
                onClickHandler={goToIndex}
              />
              {slides}
              {activeIndex !== 0 && (
                <CarouselControl
                  direction="prev"
                  directionText="Previous"
                  onClickHandler={previous}
                />
              )}
              {activeIndex !== tutorials.length - 1 && (
                <CarouselControl
                  direction="next"
                  directionText="Next"
                  onClickHandler={next}
                />
              )}
            </Carousel>
          </div>
        </ModalBody>
      </Modal>
    );
  };

  return (
    <Container className="h-100 d-flex justify-content-center" fluid>
      <Card className="waiting-card">
        <Row className="justify-content-center" style={{ gap: '1rem' }}>
          <Row>
            <div>
              <Button
                className="mt-2 mx-2 btn-create position-absolute top-0 start-0"
                onClick={backToIndex}
              >
                Back
              </Button>
              <Row className="justify-content-center">
                <Col md="8">
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
          <Row className="justify-content-center" style={{ gap: '0' }}>
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
                    {Object.keys(opponent).length === 0 ? '???' : opponentName}
                  </span>
                  <span></span>
                </Row>
                <Row>
                  <img
                    src={
                      Object.keys(opponent).length === 0
                        ? '/img/anno.png'
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
              {renderButton()}
            </Col>
          </Row>
          <Row>
            <Col md="4" className="align-vertical-center">
              <FontAwesomeIcon icon={faUser} size="2x" className="" />
              &nbsp;<span className="fs-1">{currentPlayer}</span>
            </Col>
            <Col md="4"></Col>
            <Col md="4">
              <a
                className="instruction mb-1 mx-1 position-absolute bottom-0 end-0"
                onClick={() => setShowModal(prev => !prev)}
              >
                <img
                  src="/img/instruction-icon.jpg"
                  className="img-fluid rounded w-100"
                />
              </a>
            </Col>
            {renderModal()}
          </Row>
        </Row>
      </Card>
    </Container>
  );
};

export default Waiting;
