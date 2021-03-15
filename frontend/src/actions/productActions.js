import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAILED,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAILED,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_FAILED,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_FAILED,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_RESET,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAILED,
} from "../constants/productConstants";
import axios from "axios";

export const listProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    const { data } = await axios.get("http://localhost:5000/api/products");

    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data.products });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAILED,
      error:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listProductDetail = (productId) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const { data } = await axios.get(
      `http://localhost:5000/api/products/${productId}`
    );

    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data.product });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAILED,
      error:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_DELETE_REQUEST });
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
      `http://localhost:5000/api/products/${id}`,
      config
    );
    dispatch({ type: PRODUCT_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAILED,
      payload: error.response && error.response.data.message,
    });
  }
};
