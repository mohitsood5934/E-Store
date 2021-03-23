import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { signup } from "../actions/userActions";

const SignUpScreen = ({ location, history }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState();
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const userSignUp = useSelector((state) => state.userSignUp);
  const { loading, error, userInfo } = userSignUp;

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signup(name, email, mobileNumber, password))
    history.push('/');
  };

  return (
    <>
     <Helmet>
        <meta charSet="utf-8" />
        <title>E-SHOP | Sign Up</title>
        <meta name="description" content="Sign Up  page for customers" />
      </Helmet>
    <div className="row">
      <div className="col-md-6 offset-md-3">
      <h1 style={{textAlign:'center'}}>Sign Up </h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="mobileNumber">
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Sign Up
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          Already have an account?
          <Link to="/login">Login</Link>
        </Col>
      </Row>
      </div>
    </div>
     
    </>
  );
};

export default SignUpScreen;
