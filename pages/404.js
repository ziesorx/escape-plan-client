import Router from 'next/router';
import { Button, Card, CardBody, Container, Col, Row } from 'reactstrap';

function Error404() {
  const onBackClick = () => {
    Router.push('/');
  };

  return (
    <Container className="mt--6 pb-5" fluid>
      <Row className="justify-content-center mx-auto">
        <Col md="5">
          <Card
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '3px solid white',
            }}
          >
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center mb-4">
                <p className="display-5">😧 Oops!</p>
                <br />
                <p className="display-1">404 Error</p>
                <br />
                <p className="h1">Page Not Found</p>
              </div>

              <Row>
                <Col>
                  <Button
                    block
                    className="mt-4 btn-create"
                    onClick={onBackClick}
                    size="lg"
                  >
                    Back to Starting page
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Error404;
