/* eslint-disable @next/next/no-img-element */
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { avatars } from '../variables/avatars';

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

import { clearUser } from '../store/features/userSlice';
import { clearCurrentRoom } from '../store/features/roomSlice';

const Waiting = () => {
  const { user } = useSelector((state) => state.user);
  const { currentRoom } = useSelector((state) => state.room);
  const [userNo, setUserNo] = useState(1);

  const userAvatar = avatars.filter((avatar) => avatar.id === user.avatarId);
  const userName = user.name;

  const dispatch = useDispatch();

  const backToIndex = () => {
    dispatch(clearCurrentRoom());

    Router.push('/');
  };

  const toGameroom = () => {
    Router.push('/game-time');
  };

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const isHost = () => {};

  // if (!currentRoom) return;

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
                        <span className="display-3">{currentRoom}</span>
                      </CardBody>
                    </Col>
                  </Row>
                </div>
              </Row>
              <Row className="justify-content-center">
                <Col md="4">
                  <Card className="text-md-center fs-2">
                    <Row>
                      <span>{userName}</span>
                    </Row>
                    <Row>
                      <img src={userAvatar[0].img_src} alt="Pacman avatar" />
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
                      <span>???</span>
                      <span></span>
                    </Row>
                    <Row>
                      <img src={avatars[1].img_src} alt="Pacman avatar" />
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col md="3" className="text-center">
                  <Button color="danger" onClick={toGameroom} size="lg">
                    <span className="fs-3">Start</span>
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col md="4" className="align-vertical-center">
                  <FontAwesomeIcon icon={faUser} size="2x" className="" />
                  &nbsp;<span className="fs-1">{userNo}</span>
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
                    One day, there is a man who's a chad, namely Pond, and he
                    stole the most prestiegeous diamond in the world from the
                    most famous shop keeper name Poraor. Try your best to escape
                    or catch the chad!!!
                    <Card>
                      <img src="/img/gigachad.jpeg"></img>
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
