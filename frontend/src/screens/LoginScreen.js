import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { login } from "../actions/userActions";

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(login(email, password));
    localStorage.setItem('isLoggedIn',true);
  };

  useEffect(() => {
    if ( typeof(userInfo) !== 'undefined' && userInfo.hasOwnProperty('user')) {
      history.push(redirect);
    }
  }, [userInfo, history, redirect]);

  return (
    <>
     <Helmet>
        <meta charSet="utf-8" />
        <title>E-SHOP | Login</title>
        <meta name="description" content="Login page for customers" />
      </Helmet>
    <div className="row">
      <div className="offset-md-3 col-md-6">
      <h1 style={{textAlign:'center'}}>Sign In </h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Login
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          New Customer?
          <Link to="/signup">Register here</Link>
        </Col>
      </Row>
      </div>
    </div>
     
    </>
  );
};

export default LoginScreen;
