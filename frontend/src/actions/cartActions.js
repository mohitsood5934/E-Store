import axios from "axios";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from "../constants/cartConstants";

const API_URL =
  process.env.REACT_APP_ENVIRONMENT === "development"
    ? process.env.REACT_APP_API_DEVELOPMENT
    : process.env.REACT_APP_API_PRODUCTION;

//redux-thunk allows us to make async call by passing a function
export const addToCart = (productId, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`${API_URL}/api/products/${productId}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data.product._id,
      name: data.product.name,
      image: data.product.image,
      price: data.product.price,
      countInStock: data.product.countInStock,
      qty,
    },
  });
  //we can save only string in local storage
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (product) => async (dispatch, getState) => {
  dispatch({ type: CART_REMOVE_ITEM, payload: product });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => async (dispatch) => {
  dispatch({ type: CART_SAVE_SHIPPING_ADDRESS, payload: data });
  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

export const savePaymentMethod = (data) => async (dispatch) => {
  dispatch({ type: CART_SAVE_PAYMENT_METHOD, payload: data });
  localStorage.setItem("paymentMethod", data);
};
