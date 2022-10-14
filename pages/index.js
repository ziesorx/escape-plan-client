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
} from 'reactstrap';

const LandingPage = () => {
  const [name, setName] = useState('');
  const [disButton, setDisButton] = useState(false);

  useEffect(() => {
    socket.on('player:create-done', (name, avatar, role) => {
      console.log(name);
    });
  }, []);

  const onJoinClick = () => {
    setDisButton(true);
    socket.emit('player:create', name, '1');
  };

  const renderSpinner = () => {
    return <Spinner animation="border" role="status" size="sm"></Spinner>;
  };

  const renderAvatar = () => {
    return (
      <span className="avatar" onClick={e => e.preventDefault()}>
        <img
          alt="profile picture"
          src="/profile-picture.png"
          className="img-fluid rounded-circle w-100"
        />
      </span>
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
                position: 'absolute',
                top: '46%',
                transform: 'translate(0, -50%)',
                width: '40%',
              }}
            >
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center mb-4">
                  <strong style={{ fontSize: '1.5rem' }}>
                    Welcome to Escape Plan
                  </strong>
                </div>
                <Row className="align-items-center">
                  <Col md="3">Name:</Col>
                  <Col md="9">
                    <Input
                      placeholder="Enter your name..."
                      onChange={e => setName(e.target.value)}
                    />
                  </Col>
                </Row>

                <Row className="mt-3 justify-content-between">
                  {/* {() => {
                    for (let i = 0; i < 5; i++) {
                      renderAvatar();
                    }
                  }} */}
                  {renderAvatar()}
                  {renderAvatar()}
                  {renderAvatar()}
                  {renderAvatar()}
                  {renderAvatar()}
                </Row>

                <Row>
                  <Button
                    color="dark"
                    className="mt-3"
                    onClick={onJoinClick}
                    disabled={disButton}
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
