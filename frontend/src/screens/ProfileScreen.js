import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getUserDetails, updateUserDetails } from "../actions/userActions";
import { fetchMyOrders } from "../actions/orderActions";

const ProfileScreen = ({ location, history }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState();
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, userData } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdate = useSelector((state) => state.userUpdate);
  const { success } = userUpdate;

  const orderList = useSelector((state) => state.orderList);
  const { loading: loadingOrders, orders, error: errorOrders } = orderList;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      dispatch(getUserDetails("profile"));
      dispatch(fetchMyOrders());
      setName(userInfo && userInfo.user.name);
      setEmail(userInfo && userInfo.user.email);
      setMobileNumber(userInfo && userInfo.user.mobileNumber);
    }
  }, [history, userInfo,success]);

  const submitHandler = (e) => {
    e.preventDefault();
    const { _id } = userInfo.user;
    dispatch(updateUserDetails({ _id, name, email, password, mobileNumber }));
    //dispatch update profile
    // dispatch(signup(name, email, mobileNumber, password));
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>E-SHOP | Profile</title>
        <meta name="description" content="User Profile" />
      </Helmet>
    <Row>
      <Col md={3}>
        <h2>User Profile </h2>
        {error && <Message variant="danger">{error}</Message>}
        {success && <Message variant="success">Profile updated</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="mobileNumber">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              disabled
            ></Form.Control>
          </Form.Group>
          {/* <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary">
            Update
          </Button> */}
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tbody>
                <tr>
                  <th>Id</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                  <th>View</th>
                </tr>
                {orders &&
                  orders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{moment(order.createdAt).format("DD/ MM /YYYY")}</td>
                      <td>{order.totalPrice}</td>
                      <td>{order.isPaid ? "Yes" : "No"}</td>
                      <td>{order.isDelivered ? "Yes" : "No"}</td>
                      <td>
                        <LinkContainer to={`/order/${order._id}`}>
                          <Button variant="light">Details</Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </thead>
          </Table>
        )}
      </Col>
    </Row>
    </>
  );
};

export default ProfileScreen;
