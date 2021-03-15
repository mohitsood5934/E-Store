import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import UserListScreen from "./screens/UserListScreen";
import ProductListScreen from './screens/ProductListScreen';

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Route path="/admin/productlist" component={ProductListScreen} exact />
          <Route path="/admin/userlist" component={UserListScreen} exact />
          <Route path="/order/:id" component={OrderScreen} exact />
          <Route path="/place-order" component={PlaceOrderScreen} exact />
          <Route path="/payment" component={PaymentScreen} exact />
          <Route path="/shipping" component={ShippingScreen} exact />
          <Route path="/profile" component={ProfileScreen} exact />
          <Route path="/signup" component={SignUpScreen} exact />
          <Route path="/login" component={LoginScreen} exact />
          <Route path="/product/:id" component={ProductScreen} exact />
          <Route path="/cart/:id?" component={CartScreen} exact />
          <Route path="/" component={HomeScreen} exact />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
