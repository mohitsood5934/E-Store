import React, { useState, useEffect } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import axios from "axios";
import { Button, Row, Col, ListGroup, Card, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import CheckOut from "../components/CheckOut";
import {
  fetchOrderById,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import Loader from "../components/Loader";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

const OrderScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, error, orderInfo } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [sdkReady, setSdkReady] = useState(false);

  //https://developer.paypal.com/docs/checkout/reference/customize-sdk/
  //sb-fptts5367162@personal.example.com
  //uYC7i)'^
  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get(
        "http://localhost:5000/api/config/paypal"
      );
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!orderInfo || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(fetchOrderById(match.params.id));
    } else if (!orderInfo.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, match, orderInfo, successPay, successDeliver]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(match.params.id, paymentResult));
  };

  const deliverOrderHandler = (id) => {
    dispatch(deliverOrder(match.params.id));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order Details</h1>

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name:{orderInfo.user.name}</strong>
              </p>
              <p>
                <strong>Email:{orderInfo.user.email}</strong>
              </p>
              <p>
                <strong>Mobile Number:{orderInfo.user.mobileNumber}</strong>
              </p>
              <p>
                <strong>Address:</strong>
                {orderInfo.shippingAddress.address}
                {orderInfo.shippingAddress.city}
                {orderInfo.shippingAddress.postalCode}
                {orderInfo.shippingAddress.country},
                {orderInfo.shippingAddress.mobileNumber}
              </p>
              {orderInfo.isDelivered ? (
                <Message variant="success">
                  Delivered on on {orderInfo.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <p>
                {" "}
                <h2>Payment Method</h2>
                <strong>Method:</strong>
                {orderInfo.paymentMethod}
              </p>
              {orderInfo.isPaid ? (
                <Message variant="success">Paid on {orderInfo.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {orderInfo.orderItems.length === 0 ? (
                <Message>Your orderInfo is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {orderInfo.orderItems.map((item, index) => {
                    return (
                      <ListGroup key={index} className="mt-2">
                        <Row>
                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={4}>
                            {item.qty} * ${item.price} = $
                            {item.qty * item.price}
                          </Col>
                        </Row>
                      </ListGroup>
                    );
                  })}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>
                    $
                    {orderInfo.orderItems.reduce((acc, item) => {
                      return acc + item.price * item.qty;
                    }, 0)}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping Prie</Col>
                  <Col>${orderInfo.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${orderInfo.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total Price</Col>
                  <Col>${orderInfo.totalPrice} </Col>
                </Row>
              </ListGroup.Item>
              {!orderInfo.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={orderInfo.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
              {userInfo &&
                userInfo.user &&
                userInfo.user.isAdmin &&
                orderInfo.isPaid &&
                !orderInfo.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      className="btn btn-block"
                      onClick={deliverOrderHandler}
                    >
                      Mark Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
