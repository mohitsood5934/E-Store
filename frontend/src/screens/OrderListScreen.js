import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { fetchAllOrders } from "../actions/orderActions";
import moment from "moment";

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch();
  const orderListAll = useSelector((state) => state.orderListAll);
  const { loading, error, orders } = orderListAll;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.user.isAdmin) {
      dispatch(fetchAllOrders());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tbody>
              <tr>
                <th>Id</th>
                <th>User</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Delivered</th>
                <td>Details</td>
              </tr>
              {orders &&
                orders.map((order, index) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order._id}</td>
                    <td>{moment(order.createdAt).format("DD/ MM /YYYY")}</td>
                    <td>{order.totalPrice}</td>
                    <td>{order.isPaid ? "Yes" : "No"}</td>
                    <td>{order.isDelivered ? "Yes" : "No"}</td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button variant="light" className="btn-sm">
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
            </tbody>
          </thead>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
