import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Button,
  Card,
  ListGroup,
  Image,
  Form,
} from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../actions/cartActions";

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id;
  const qty = location.search ? Number(location.search.split("=")[1]) : 1;

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, qty, productId]);

  const checkOutHandler = () => {
    history.push("/login?redirect=shipping");
  };

  const removeFromCartHandler = (productId) => {
    dispatch(removeFromCart(productId));
  };

  let totalItems = 0;
  if (cartItems.length > 0) {
    cartItems.forEach((cartItem, index) => {
      totalItems += cartItem.qty;
    });
  }
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>E-Shop | Cart</title>
        <meta
          name="description"
          content="Shopping cart - where you can manage your products"
        />
      </Helmet>
      <Row>
        <Col md={8}>
          <h1>
            Shopping Cart
            {cartItems.length === 0 ? (
              <Message>
                <h5>
                  Your cart is empty <Link to="/">Go Back</Link>
                </h5>
              </Message>
            ) : (
              <ListGroup variant="flush">
                {cartItems.map((item) => {
                  return (
                    <ListGroup.Item key={item.product}>
                      <Row>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col md={3}>
                          <Link to={`/product/${item.product}`}>
                            <h5>{item.name}</h5>
                          </Link>
                        </Col>
                        <Col md={2}>
                          <h5>${item.price}</h5>
                        </Col>
                        <Col md={2}>
                          <Form.Control
                            as="select"
                            value={item.qty}
                            onChange={(e) =>
                              dispatch(
                                addToCart(item.product, Number(e.target.value))
                              )
                            }
                          >
                            {[...Array(item.countInStock).keys()].map((x) => {
                              return (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              );
                            })}
                          </Form.Control>
                        </Col>
                        <Col md={2}>
                          <Button
                            type="button"
                            variant="light"
                            onClick={() => removeFromCartHandler(item.product)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            )}
          </h1>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h5>SubTotal items {totalItems}</h5>
              </ListGroup.Item>
              <ListGroup.Item>
                ${" "}
                {cartItems
                  .reduce((acc, cartItem) => {
                    return acc + cartItem.qty * cartItem.price;
                  }, 0)
                  .toFixed(2)}
              </ListGroup.Item>
            </ListGroup>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn btn-block"
                disabled={cartItems.length === 0}
                onClick={checkOutHandler}
              >
                Proceed to Checkout
              </Button>
            </ListGroup.Item>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CartScreen;
