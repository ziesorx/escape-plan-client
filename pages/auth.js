/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { socket } from '../services/socket';
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
import { useDispatch } from 'react-redux';

import { avatars } from '../variables/avatars';
import { setOpponent, setUser } from '../store/features/userSlice';
import Router from 'next/router';
import Swal from 'sweetalert2';

const Auth = () => {
  const [name, setName] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);
  const [disButton, setDisButton] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('user:login-done', userInfo => {
      dispatch(setUser(userInfo));

      Router.push('/main-menu');
    });

    socket.on('user:error', message => {
      if (message === 'already login') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'This user already in server',
          confirmButtonText: 'Try again',
          allowOutsideClick: false,
        }).then(result => {
          setDisButton(false);
          setName('');
        });
      }
    });
  }, []);

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
          className={`img-fluid rounded-circle w-100 ${avatar.color}`}
          style={{ objectFit: 'fill' }}
        />
      </Button>
    );
  };

  const onLoginClick = () => {
    setDisButton(true);

    if (!name) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill your name!',
      });
      setDisButton(false);
      return;
    }

    if (!selectedAvatarId) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select an avatar!',
      });
      setDisButton(false);
      return;
    }

    socket.emit('user:login', name, selectedAvatarId);
  };

  return (
    <>
      <Container className="mt--6 pb-5" fluid>
        <Row className="justify-content-center mx-auto">
          <Col md="8">
            <Card className="auth-card">
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center mb-5">
                  <strong className="fs-1">
                    Welcome to
                    <br /> Escape Plan
                  </strong>
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
                  <Button
                    className="mt-4 btn-create"
                    onClick={onLoginClick}
                    disabled={disButton}
                    size="lg"
                  >
                    {disButton ? renderSpinner() : 'Login'}
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

export default Auth;
