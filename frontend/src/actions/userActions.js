import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILED,
  USER_LOGOUT,
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAILED,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAILED,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_REQUEST,
  USER_UPDATE_FAILED,
  USER_DETAILS_RESET,
  USER_LIST_SUCCESS,
  USER_LIST_FAILED,
  USER_LIST_REQUEST,
  USER_LIST_RESET,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILED,
  
} from "../constants/userConstants";
import { ORDER_LIST_MY_RESET } from "../constants/orderConstants";
import { CART_RESET } from "../constants/cartConstants";

import axios from "axios";

const API_URL =
  process.env.REACT_APP_ENVIRONMENT === "development"
    ? process.env.REACT_APP_API_DEVELOPMENT
    : process.env.REACT_APP_API_PRODUCTION;

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(
      `${API_URL}/api/users/login`,
      { email, password },
      config
    );
    dispatch({ type: USER_LOGIN_SUCCESS, payload: response.data });
    localStorage.setItem("userInfo", JSON.stringify(response.data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAILED,
      payload: error.response && error.response.data.message,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: ORDER_LIST_MY_RESET });
  dispatch({ type: USER_LIST_RESET });
  dispatch({ type: CART_RESET });
  localStorage.removeItem("isLoggedIn");
};

export const signup = (name, email, mobileNumber, password) => async (
  dispatch
) => {
  try {
    dispatch({ type: USER_SIGNUP_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(
      `${API_URL}/api/users/signup`,
      { name, email, mobileNumber, password },
      config
    );
    dispatch({ type: USER_SIGNUP_SUCCESS, payload: response.data });
    localStorage.setItem("userInfo", JSON.stringify(response.data));
  } catch (error) {
    dispatch({
      type: USER_SIGNUP_FAILED,
      payload: error.response && error.response.data.message,
    });
  }
};

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
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
      `${API_URL}/api/users/${id}`,
      config
    );
    dispatch({ type: USER_DETAILS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAILED,
      payload: error.response && error.response.data.message,
    });
  }
};

export const updateUserDetails = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });
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
      `${API_URL}/api/users/profile`,
      user,
      config
    );
    dispatch({ type: USER_UPDATE_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAILED,
      payload: error.response && error.response.data.message,
    });
  }
};
export const getUserList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.user.token}`,
      },
    };

    const response = await axios.get(`${API_URL}/api/users`, config);
    dispatch({ type: USER_LIST_SUCCESS, payload: response.data.users });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAILED,
      payload: error.response && error.response.data.message,
    });
  }
};
export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.user.token}`,
      },
    };

    const response = await axios.delete(
      `${API_URL}/api/users/${id}`,
      config
    );
    dispatch({ type: DELETE_USER_SUCCESS });
  } catch (error) {
    dispatch({
      type: DELETE_USER_FAILED,
      payload: error.response && error.response.data.message,
    });
  }
};

