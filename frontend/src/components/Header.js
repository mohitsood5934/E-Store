import React from "react";
import { useHistory } from "react-router-dom";
import { Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Container } from "react-bootstrap";
import SearchBox from "./SearchBox";
import { logout } from "../actions/userActions";

const Header = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();
  let history = useHistory();

  const logOutHandler = async () => {
    await dispatch(logout());
    history.push("/");
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Pro Shop</Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Route render={({ history }) => <SearchBox history={history} />} />
            <Nav className="ml-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart mr-1" />
                  Cart
                </Nav.Link>
              </LinkContainer>
              {!userInfo && (
                <LinkContainer to="/signup">
                  <Nav.Link>Sign Up</Nav.Link>
                </LinkContainer>
              )}
              {!userInfo && (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user mr-1" />
                    Login
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.user && userInfo.user.isAdmin && (
                <>
                  <LinkContainer to="/admin/userlist">
                    <Nav.Link>Users</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/admin/productlist">
                    <Nav.Link>Products</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <Nav.Link>Orders</Nav.Link>
                  </LinkContainer>
                </>
              )}
              {userInfo && (
                <>
                  <LinkContainer to="/profile">
                    <Nav.Link>Profile</Nav.Link>
                  </LinkContainer>
                  <Nav.Link onClick={logOutHandler}>Logout</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
