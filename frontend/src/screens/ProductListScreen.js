import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listProducts ,deleteProduct} from "../actions/productActions";

const ProductListScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productDelete = useSelector((state) => state.productDelete);
  const { loading:loadingProduct, error:productError, success:successDelete } = productDelete;

  useEffect(() => {
    if (userInfo && userInfo.user.isAdmin) {
      dispatch(listProducts());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo,successDelete]);

  const deleteSelectedProduct = (id) => {
    if (window.confirm("Are you sure ?")) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {};

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i>Create Product
          </Button>
        </Col>
      </Row>
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
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Actions</th>
              </tr>
              {products &&
                products.map((product, index) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{[product.price]}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      <LinkContainer to={`/admin/product/${product._id}`}>
                        <Button variant="light" className="btn-sm">
                          <i className="fas fa-edit"></i>
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteSelectedProduct(product._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
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

export default ProductListScreen;
