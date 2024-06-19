import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const NotFound = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h3 className="text-danger">404 page not found</h3>
          <p>We are sorry but the page you are looking for does not exist.</p>
          <button className="btn btn-outline-light my-2">Back To Home Page</button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
