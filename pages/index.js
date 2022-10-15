/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
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

const LandingPage = () => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);
  const [disCreateButton, setDisCreateButton] = useState(false);
  const [disJoinButton, setDisJoinButton] = useState(false);
  const [joinRoom, setJoinRoom] = useState(false);

  useEffect(() => {
    socket.on('player:create-done', (name, avatar, role) => {
      console.log(name);
    });
  }, []);

  const onCreateClick = () => {
    setDisCreateButton(true);

    Swal.fire({
      title: `Room Created!`,
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
    }).then(result => setDisCreateButton(false));
  };

  const onJoinRoomClick = () => {
    setJoinRoom(true);
  };

  const onJoinClick = () => {
    setDisJoinButton(true);

    if (!roomId) {
      Swal.fire({
        title: `Please enter room id`,
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      }).then(result => {
        setDisJoinButton(false);
      });

      return;
    }

    Swal.fire({
      title: `Welcome ${name}!`,
      text: `Joined room ${roomId}`,
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
    }).then(result => {
      setDisJoinButton(false);
      setRoomId('');
    });
    // socket.emit('player:create', name, '1');
  };

  const renderSpinner = () => {
    return <Spinner animation="border" role="status" size="sm"></Spinner>;
  };

  const renderAvatar = avatar => {
    return (
      <Button
        key={avatar.id}
        className="avatar bg-transparent border-0"
        onClick={e => {
          e.preventDefault();
          setSelectedAvatarId(avatar.id);
        }}
        active={selectedAvatarId === avatar.id}
      >
        <img
          alt="profile picture"
          src={avatar.img_src}
          className="img-fluid rounded-circle w-100"
          style={{ objectFit: 'fill' }}
        />
      </Button>
    );
  };

  const renderJoinButton = () => {
    return (
      <Col>
        <Button
          block
          color="dark"
          className="mt-4"
          onClick={onJoinRoomClick}
          size="lg"
        >
          Join Room
        </Button>
      </Col>
    );
  };

  const renderJoin = () => {
    return (
      <>
        <Col md="8">
          <Input
            bsSize="lg"
            placeholder="Enter your room id"
            onChange={e => setRoomId(e.target.value)}
            value={roomId}
          />
        </Col>
        <Col md="4">
          <Button
            block
            color="dark"
            className="mt-4"
            onClick={onJoinClick}
            disabled={disJoinButton}
            size="lg"
          >
            {disJoinButton ? renderSpinner() : 'Join'}
          </Button>
        </Col>
      </>
    );
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
                <div className="text-center mb-4">
                  <strong className="fs-1">Welcome to Escape Plan</strong>
                </div>
                <Row className="align-items-center">
                  <Col md="3" className="text-center">
                    <span className="fs-4">Name:</span>
                  </Col>
                  <Col md="9">
                    <Input
                      bsSize="lg"
                      placeholder="Enter your name..."
                      onChange={e => setName(e.target.value)}
                      value={name}
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <ButtonGroup className="justify-content-between">
                    {avatars.map(avatar => renderAvatar(avatar))}
                  </ButtonGroup>
                </Row>

                <Row>
                  <Col>
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

                <Row className="align-items-end">
                  {joinRoom ? renderJoin() : renderJoinButton()}
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
