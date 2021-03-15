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
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAILED,
  USER_UPDATE_RESET,
  USER_DETAILS_RESET,
  USER_LIST_REQUEST,
  USER_LIST_FAILED,
  USER_LIST_SUCCESS,
  USER_LIST_RESET,
  DELETE_USER_REQUEST,
  DELETE_USER_FAILED,
  DELETE_USER_SUCCESS,
} from "../constants/userConstants";

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };

    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };

    case USER_LOGIN_FAILED:
      return { loading: false, error: action.payload };

    case USER_LOGOUT:
      return {};

    default:
      return state;
  }
};

export const userSignUpReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_SIGNUP_REQUEST:
      return { loading: true };

    case USER_SIGNUP_SUCCESS:
      return { loading: false, userInfo: action.payload };

    case USER_SIGNUP_FAILED:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const userDetailsReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return { ...state, loading: true };

    case USER_DETAILS_SUCCESS:
      return { loading: false, userData: action.payload };

    case USER_DETAILS_FAILED:
      return { loading: false, error: action.payload };
    case USER_DETAILS_RESET:
      return { user: {} };
    default:
      return state;
  }
};

export const userUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_REQUEST:
      return { ...state, loading: true };

    case USER_UPDATE_SUCCESS:
      return { loading: false, success: true, userInfo: action.payload };

    case USER_UPDATE_FAILED:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const userListReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case USER_LIST_REQUEST:
      return { ...state, loading: true };

    case USER_LIST_SUCCESS:
      return { loading: false, users: action.payload };

    case USER_LIST_FAILED:
      return { loading: false, error: action.payload };
    case USER_LIST_RESET:
      return { users: [] };
    default:
      return state;
  }
};

export const userDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_USER_REQUEST:
      return { loading: true };

    case DELETE_USER_SUCCESS:
      return { loading: false, success: true };

    case DELETE_USER_FAILED:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
