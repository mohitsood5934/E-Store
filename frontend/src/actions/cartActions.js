import axios from "axios";
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../constants/cartConstants";

//redux-thunk allows us to make async call by passing a function
export const addToCart = (productId, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(
    `http://localhost:5000/api/products/${productId}`
  );

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
