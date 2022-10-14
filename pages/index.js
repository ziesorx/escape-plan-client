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
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [disButton, setDisButton] = useState(false);

  useEffect(() => {
    socket.on('player:create-done', (name, avatar, role) => {
      console.log(name);
    });
  }, []);

  const onJoinClick = () => {
    setDisButton(true);

    Swal.fire({
      title: `Welcome ${name}!`,
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
    }).then(result => setDisButton(false));
    // socket.emit('player:create', name, '1');
  };

  const renderSpinner = () => {
    return <Spinner animation="border" role="status" size="sm"></Spinner>;
  };

  const renderAvatar = avatar => {
    return (
      <Button
        className="avatar bg-transparent border-0"
        onClick={e => {
          e.preventDefault();
          setSelectedAvatar(avatar.id);
        }}
        active={selectedAvatar === avatar.id}
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

  return (
    <>
      <Container className="mt--6 pb-5" fluid>
        <Row className="justify-content-center mx-auto">
          <Col md="5">
            <Card
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
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
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <ButtonGroup className="justify-content-between">
                    {avatars.map(avatar => renderAvatar(avatar))}
                  </ButtonGroup>
                </Row>

                <Row>
                  <Button
                    color="dark"
                    className="mt-4"
                    onClick={onJoinClick}
                    disabled={disButton}
                    size="lg"
                  >
                    {disButton ? renderSpinner() : 'Join Game'}
                  </Button>
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
