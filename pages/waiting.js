/* eslint-disable @next/next/no-img-element */
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

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

const Waiting = () => {
  const backToIndex = () => {
    Router.push('/');
  };

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  useEffect(() => {
    console.log(FontAwesomeIcon);
  }, []);

  return (
    <>
      <Container className="px-0" fluid>
        <Card
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '3px solid white',
            // height: '90vh',
          }}
        >
          <Row className="justify-content-center" style={{ gap: '5rem' }}>
            <Row>
              <div>
                <Button className="mt-2 mx-2 btn-create" onClick={backToIndex}>
                  Back
                </Button>
                <Row className="justify-content-center">
                  <Col md="4">
                    <CardBody className="text-center fs-1">Waiting...</CardBody>
                  </Col>
                </Row>
              </div>
            </Row>

            <Row className="justify-content-center">
              <Col md="4">
                <Card className="text-md-center fs-2">
                  <Row>
                    <span>Player 1</span>
                  </Row>
                  <Row>
                    <img src="/img/police-icon.png" />
                  </Row>
                </Card>
              </Col>
              <Col md="4">
                <img src="/img/vs-logo.png" className="img-fluid"></img>
              </Col>
              <Col md="4">
                <Card className="text-md-center fs-2">
                  <Row>
                    <span>Player 2</span>
                    <span></span>
                  </Row>
                  <Row>
                    <img src="/img/prisoner-icon.png" />
                  </Row>
                </Card>
              </Col>
            </Row>

            <Row>
              <div>
                <Button color="success" className="mb-2 mx-2">
                  <FontAwesomeIcon icon={faUser} />
                </Button>
                <Button
                  className="mb-2 mx-2 btn-create position-absolute bottom-0 end-0"
                  onClick={toggle}
                >
                  ?
                </Button>
                <Modal isOpen={modal} toggle={toggle}>
                  <ModalHeader toggle={toggle}>
                    How to play this game
                  </ModalHeader>
                  <ModalBody>
                    One day, there is a Nigga who's a chad, namely Pond, and he
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
              </div>
            </Row>
          </Row>
        </Card>
      </Container>
    </>
  );
};

export default Waiting;
