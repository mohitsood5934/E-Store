import axios from "axios";
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAILED,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAILED,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAILED,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAILED,
} from "../constants/orderConstants";

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.user.token}`,
      },
    };
    const response = await axios.post(
      `http://localhost:5000/api/orders/create`,
      order,
      config
    );
    const { data } = response;
    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.createdOrder });
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAILED,
      payload: error.response && error.response.data.message,
    });
  }
};

export const fetchOrderById = (id) => async (dispatch, getState) => {
    try {
      dispatch({ type: ORDER_DETAILS_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.user.token}`,
        },
      };
      const response = await axios.get(
        `http://localhost:5000/api/orders/${id}`,
        config
      );
      const { data } = response;
      dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data.order });
    } catch (error) {
      dispatch({
        type: ORDER_DETAILS_FAILED,
        payload: error.response && error.response.data.message,
      });
    }
  };

  export const payOrder = (id,paymentResult) => async (dispatch, getState) => {
    try {
      dispatch({ type: ORDER_PAY_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.user.token}`,
        },
      };
      const response = await axios.put(
        `http://localhost:5000/api/orders/${id}/pay`,
        paymentResult,
        config
      );
      const { data } = response;
      dispatch({ type: ORDER_PAY_SUCCESS, payload: data.updatedOrder });
    } catch (error) {
      dispatch({
        type: ORDER_PAY_FAILED,
        payload: error.response && error.response.data.message,
      });
    }
  };

  export const fetchMyOrders = () => async (dispatch, getState) => {
    console.log("here-------------------")
    try {
      dispatch({ type: ORDER_LIST_MY_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.user.token}`,
        },
      };
      const response = await axios.get(
        `http://localhost:5000/api/orders/my-orders`,
        config
      );
      const { data } = response;
      dispatch({ type: ORDER_LIST_MY_SUCCESS, payload: data.orders });
    } catch (error) {
      dispatch({
        type: ORDER_LIST_MY_FAILED,
        payload: error.response && error.response.data.message,
      });
    }
  };
  